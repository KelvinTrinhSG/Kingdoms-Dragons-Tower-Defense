import { bus } from '../bus.js';
import { eraData, eraTrapIds, trapDef } from '../data/eras.js';
import { ICONS, trapIcons } from './icons.js';

// Shop button (middle of the left edge) + Shop panel with the 3 current-era traps and the Inventory.
// Traps cannot be sold: there is only a Buy button.
export function initShop(root) {
  const el = document.createElement('div');
  el.className = 'shop hidden';
  el.innerHTML = `
    <button class="btn btn-orange shop-toggle" data-act="toggle">Shop</button>
    <div class="card shop-panel hidden">
      <div class="shop-head"><h2>Shop</h2><button class="close-x" data-act="toggle" aria-label="Close">×</button></div>
      <div class="shop-list"></div>
      <div class="inv">
        <div class="inv-title">Inventory</div>
        <div class="inv-list"></div>
        <div class="inv-hint">Tap a path cell to place a trap.</div>
      </div>
    </div>`;
  root.appendChild(el);

  const panel = el.querySelector('.shop-panel');
  const list = el.querySelector('.shop-list');
  const inv = el.querySelector('.inv-list');
  let state = null;

  const render = () => {
    if (!state) return;
    const ids = eraTrapIds(state.era);
    const enemies = eraData(state.era).enemies;
    list.innerHTML = ids
      .map((id) => {
        const t = trapDef(id);
        const short = Math.max(0, t.price - state.money);
        return `
        <div class="shop-row">
          <img class="trap-img" src="${trapIcons[id] ?? ''}" alt="" />
          <div class="shop-info">
            <div class="shop-name">${t.name}</div>
            <div class="shop-meta">${t.uses} ${t.uses === 1 ? 'use' : 'uses'} · Strong vs <b>${enemies[t.counters].name}</b></div>
          </div>
          <div class="shop-buy">
            <button class="btn btn-green btn-small" data-buy="${id}" ${short ? 'disabled' : ''}>
              <i class="icon">${ICONS.money}</i>${t.price}
            </button>
            ${short ? `<span class="need">Need ${short} more</span>` : ''}
          </div>
        </div>`;
      })
      .join('');
    inv.innerHTML = ids
      .map((id) => `<div class="inv-chip ${state.inventory[id] ? '' : 'empty'}"><img src="${trapIcons[id] ?? ''}" alt="" /><span>×${state.inventory[id] ?? 0}</span></div>`)
      .join('');
  };

  el.addEventListener('click', (e) => {
    const buy = e.target.closest('[data-buy]');
    if (buy && !buy.disabled) bus.emit('ui:buyTrap', buy.dataset.buy);
    if (e.target.closest('[data-act="toggle"]')) {
      panel.classList.toggle('hidden');
      render();
    }
  });

  bus.on('ui:openShop', () => {
    panel.classList.remove('hidden');
    render();
  });
  bus.on('state:changed', (s) => {
    state = s;
    if (!panel.classList.contains('hidden')) render();
  });
  bus.on('scene:game', () => {
    el.classList.remove('hidden');
    panel.classList.add('hidden');
  });
  bus.on('scene:menu', () => el.classList.add('hidden'));
  bus.on('game:over', () => panel.classList.add('hidden'));
}
