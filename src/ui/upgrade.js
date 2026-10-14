import { bus } from '../bus.js';
import { eraData, LAST_ERA } from '../data/eras.js';
import { canUpgrade, missingForUpgrade, upgradeCost } from '../logic/economy.js';
import { ICONS } from './icons.js';
import { worldToUi, onLayout } from './layout.js';

// Upgrade button kept above the castle's health bar. Disabled with the missing amounts listed;
// "MAX ERA" in the last era.
export function initUpgrade(root) {
  const el = document.createElement('div');
  el.className = 'upgrade hidden';
  root.appendChild(el);
  let anchor = null;
  let lastHtml = '';

  const place = () => {
    if (!anchor) return;
    const p = worldToUi(anchor.x, anchor.y);
    el.style.left = `${p.x}px`;
    el.style.top = `${p.y}px`;
  };

  const render = (s) => {
    let html;
    if (s.era >= LAST_ERA) {
      html = `<div class="pill pill-dark max-era">Max era</div>`;
    } else {
      const cost = upgradeCost(s);
      const missing = missingForUpgrade(s);
      const ok = canUpgrade(s);
      const chips = ['stone', 'wood', 'gold']
        .map((k) => `<span class="cost ${missing[k] ? 'short' : ''}"><i class="icon">${ICONS[k]}</i>${cost[k]}</span>`)
        .join('');
      const need = ['stone', 'wood', 'gold'].filter((k) => missing[k]).map((k) => `${missing[k]} ${k}`).join(' · ');
      html = `
        <button class="btn btn-purple upgrade-btn" data-act="upgrade" ${ok ? '' : 'disabled'}>
          <span class="up-title">Upgrade <small>to ${eraData(s.era + 1).name}</small></span>
          <span class="costs">${chips}</span>
        </button>
        ${ok ? '' : `<div class="need-line">Need ${need}</div>`}`;
    }
    if (html !== lastHtml) {
      el.innerHTML = html;
      lastHtml = html;
    }
  };

  el.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act="upgrade"]');
    if (btn && !btn.disabled) bus.emit('ui:upgrade');
  });

  bus.on('castle:moved', (p) => {
    anchor = p;
    place();
  });
  onLayout(place);
  bus.on('state:changed', render);
  bus.on('scene:game', () => el.classList.remove('hidden'));
  bus.on('scene:menu', () => el.classList.add('hidden'));
  bus.on('game:over', () => el.classList.add('hidden'));
}
