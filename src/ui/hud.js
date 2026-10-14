import { bus } from '../bus.js';
import { eraData } from '../data/eras.js';
import { BALANCE } from '../data/balance.js';
import { ICONS } from './icons.js';

// Top-left: era and wave. Top-right: money, stone, wood, gold.
export function initHud(root) {
  const el = document.createElement('div');
  el.className = 'hud hidden';
  el.innerHTML = `
    <div class="hud-tl">
      <div class="pill pill-dark era-pill"><span data-el="era"></span><span class="dot">·</span><span data-el="wave"></span></div>
      <button class="btn btn-blue btn-small speed-btn" data-act="speed" title="Game speed">
        <svg viewBox="0 0 24 24" class="ff"><path d="M3 5l9 7-9 7zM12 5l9 7-9 7z" fill="currentColor"/></svg>
        <span data-el="speed">1×</span>
      </button>
    </div>
    <div class="hud-tr">
      ${['money', 'stone', 'wood', 'gold']
        .map((k) => `<div class="pill res res-${k}" title="${k}"><i class="icon">${ICONS[k]}</i><span data-res="${k}">0</span></div>`)
        .join('')}
    </div>`;
  root.appendChild(el);

  const eraEl = el.querySelector('[data-el="era"]');
  const waveEl = el.querySelector('[data-el="wave"]');
  const resEls = Object.fromEntries([...el.querySelectorAll('[data-res]')].map((n) => [n.dataset.res, n]));
  const speedEl = el.querySelector('[data-el="speed"]');
  const speedBtn = el.querySelector('.speed-btn');
  const last = {};

  speedBtn.addEventListener('click', () => bus.emit('ui:speed'));
  bus.on('scene:game', () => el.classList.remove('hidden'));
  bus.on('scene:menu', () => el.classList.add('hidden'));
  bus.on('state:changed', (s) => {
    eraEl.textContent = eraData(s.era).name;
    waveEl.textContent = s.waveRepeating ? `Wave ${s.wave}/${BALANCE.wavesPerEra} (repeat)` : `Wave ${s.wave}/${BALANCE.wavesPerEra}`;
    speedEl.textContent = `${s.speed}×`;
    speedBtn.classList.toggle('fast', s.speed > 1);
    for (const k of Object.keys(resEls)) {
      if (last[k] === s[k]) continue;
      const up = last[k] !== undefined && s[k] > last[k];
      resEls[k].textContent = s[k].toLocaleString('en-US');
      last[k] = s[k];
      if (up) {
        const pill = resEls[k].parentElement;
        pill.classList.remove('bump');
        void pill.offsetWidth;
        pill.classList.add('bump');
      }
    }
  });
}
