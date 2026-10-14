// All sound is synthesized with the Web Audio API at runtime — like the art, there are no asset files.
// Browsers only allow audio after a user gesture, so the context is created on the first press.

let ctx = null;
let master, sfxBus, musicBus, noiseBuf;
let muted = false;
const lastPlayed = {};

function init() {
  if (ctx) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.8;
  master.connect(ctx.destination);
  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.55;
  sfxBus.connect(master);
  musicBus = ctx.createGain();
  musicBus.gain.value = 0.22;
  musicBus.connect(master);
  // One second of white noise, reused for hits and thumps.
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return true;
}

// Call from any user gesture: creates or resumes the audio context.
export function unlockAudio() {
  if (!init()) return;
  if (ctx.state === 'suspended') ctx.resume();
}

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  if (ctx) master.gain.setTargetAtTime(muted ? 0 : 0.8, ctx.currentTime, 0.02);
}

// ---- building blocks ----

// One oscillator note with a quick attack and exponential release; `to` slides the pitch.
function tone(dest, { type = 'square', freq, to, at = 0, dur = 0.12, vol = 0.3 }) {
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// A filtered burst of noise (hits, thumps, whooshes).
function noise(dest, { at = 0, dur = 0.12, vol = 0.3, freq = 1200, type = 'lowpass' }) {
  const t = ctx.currentTime + at;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(dest);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.02);
}

const note = (n) => 440 * 2 ** ((n - 69) / 12); // MIDI note number -> Hz

// ---- sound effects ----

const SFX = {
  click: () => tone(sfxBus, { type: 'triangle', freq: 660, dur: 0.05, vol: 0.2 }),
  coin: () => {
    tone(sfxBus, { type: 'square', freq: note(83), dur: 0.06, vol: 0.14 });
    tone(sfxBus, { type: 'square', freq: note(88), at: 0.055, dur: 0.14, vol: 0.14 });
  },
  place: () => {
    tone(sfxBus, { type: 'triangle', freq: 260, to: 90, dur: 0.16, vol: 0.4 });
    noise(sfxBus, { dur: 0.08, vol: 0.25, freq: 900 });
  },
  trap: () => {
    noise(sfxBus, { dur: 0.1, vol: 0.3, freq: 2500, type: 'bandpass' });
    tone(sfxBus, { type: 'sawtooth', freq: 180, to: 70, dur: 0.1, vol: 0.15 });
  },
  kill: () => tone(sfxBus, { type: 'square', freq: 700, to: 180, dur: 0.16, vol: 0.12 }),
  castleHit: () => {
    noise(sfxBus, { dur: 0.25, vol: 0.5, freq: 400 });
    tone(sfxBus, { type: 'sine', freq: 110, to: 45, dur: 0.25, vol: 0.5 });
  },
  tick: () => tone(sfxBus, { type: 'sine', freq: 880, dur: 0.08, vol: 0.25 }),
  wave: () => {
    tone(sfxBus, { type: 'sawtooth', freq: note(55), dur: 0.18, vol: 0.18 });
    tone(sfxBus, { type: 'sawtooth', freq: note(60), at: 0.16, dur: 0.38, vol: 0.18 });
  },
  upgrade: () => {
    [60, 64, 67, 72, 76].forEach((n, i) => tone(sfxBus, { type: 'triangle', freq: note(n), at: i * 0.07, dur: 0.3, vol: 0.3 }));
    noise(sfxBus, { dur: 0.5, vol: 0.12, freq: 6000, type: 'highpass' });
  },
  win: () => {
    [60, 64, 67, 72, 67, 72, 76, 79].forEach((n, i) => tone(sfxBus, { type: 'square', freq: note(n), at: i * 0.12, dur: 0.22, vol: 0.14 }));
  },
  lose: () => {
    [67, 63, 60, 55].forEach((n, i) => tone(sfxBus, { type: 'triangle', freq: note(n), at: i * 0.28, dur: 0.4, vol: 0.32 }));
  },
};

// Minimum gap per sound so dozens of hits at 4x speed don't pile into noise.
const MIN_GAP = { coin: 0.03, trap: 0.05, kill: 0.05, castleHit: 0.12, click: 0.03 };

export function playSfx(name) {
  if (!ctx || muted || ctx.state !== 'running' || !SFX[name]) return;
  const now = ctx.currentTime;
  if (now - (lastPlayed[name] ?? -1) < (MIN_GAP[name] ?? 0)) return;
  lastPlayed[name] = now;
  SFX[name]();
}

// ---- background music ----
// A 4-chord loop (Am - F - C - G): bass on the beat plus a gentle arpeggio, 112 BPM.

const BPM = 112;
const STEP = 60 / BPM / 2; // eighth notes
const CHORDS = [
  [57, 60, 64], // Am
  [53, 57, 60], // F
  [48, 52, 55], // C
  [55, 59, 62], // G
];
const ARP = [0, 1, 2, 1, 2, 1, 0, 2];
let musicTimer = null;
let nextTime = 0;
let step = 0;

function scheduleStep(i, t) {
  const chord = CHORDS[Math.floor(i / 8) % CHORDS.length];
  const at = t - ctx.currentTime;
  if (i % 2 === 0) tone(musicBus, { type: 'triangle', freq: note(chord[0] - 12), at, dur: STEP * 1.8, vol: 0.5 });
  tone(musicBus, { type: 'square', freq: note(chord[ARP[i % 8]] + 12), at, dur: STEP * 0.9, vol: 0.12 });
  if (i % 4 === 2) noise(musicBus, { at, dur: 0.05, vol: 0.12, freq: 7000, type: 'highpass' });
}

export function startMusic() {
  if (!ctx || musicTimer) return;
  nextTime = ctx.currentTime + 0.1;
  step = 0;
  // Schedule a little ahead on a timer so the beat stays steady.
  musicTimer = setInterval(() => {
    while (nextTime < ctx.currentTime + 0.2) {
      scheduleStep(step++, nextTime);
      nextTime += STEP;
    }
  }, 50);
}

export function stopMusic() {
  clearInterval(musicTimer);
  musicTimer = null;
}

// Pause everything while the tab is hidden (timers are throttled there anyway).
document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) ctx.suspend();
  else ctx.resume();
});
