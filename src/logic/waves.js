import { BALANCE } from '../data/balance.js';
import { LAST_ERA } from '../data/eras.js';

const DIRS = ['N', 'E', 'S', 'W'];

function shuffle(list, rand) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

// How many of each role a wave has. Heavies arrive from Wave 4 and grow in share.
export function waveMix(wave) {
  const count = BALANCE.waveBaseCount + Math.floor((wave - 1) * BALANCE.waveCountGrowth);
  const heavyShare = wave < 4 ? 0 : Math.min(0.3, 0.06 + (wave - 4) * 0.015);
  const standardShare = Math.min(0.45, 0.2 + wave * 0.02);
  const heavy = Math.round(count * heavyShare);
  const standard = Math.round(count * standardShare);
  return { count, fast: count - heavy - standard, standard, heavy };
}

// The list of spawns for one wave: role, direction, lane, and delay (seconds from wave start).
export function buildWave(era, wave, rand = Math.random) {
  const mix = waveMix(wave);
  const roles = shuffle(
    [...Array(mix.fast).fill('fast'), ...Array(mix.standard).fill('standard'), ...Array(mix.heavy).fill('heavy')],
    rand,
  );
  const interval = Math.max(BALANCE.spawnIntervalMin, BALANCE.spawnIntervalStart - wave * BALANCE.spawnIntervalStep);
  // Cycle through the 4 directions in a shuffled order so every side gets attacked.
  const dirOrder = shuffle([...DIRS], rand);
  const spawns = roles.map((role, i) => ({
    role,
    dir: dirOrder[i % 4],
    lane: rand() < 0.5 ? 0 : 1,
    delay: i * interval,
  }));
  const hpMul = 1 + (wave - 1) * BALANCE.hpGrowth;
  return {
    era,
    wave,
    spawns,
    hpMul,
    speedMul: 1 + (wave - 1) * BALANCE.speedGrowth,
    rewardMul: hpMul,
  };
}

// What comes after a cleared wave.
export function nextWave(state) {
  const last = BALANCE.wavesPerEra;
  if (state.wave < last) return { wave: state.wave + 1, repeating: false, won: false };
  if (state.era === LAST_ERA) return { wave: last, repeating: false, won: true };
  return { wave: last, repeating: true, won: false };
}
