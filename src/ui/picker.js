import { bus } from '../bus.js';
import { eraTrapIds, trapDef } from '../data/eras.js';
import { trapIcons } from './icons.js';
import { worldToUi } from './layout.js';

// The trap picker that pops up at a tapped path cell.
export function initPicker(root) {
  const el = document.createElement('div');
  el.className = 'picker card hidden';
  root.appendChild(el);
  let state = null;
  let cell = null;

  const close = () => {
    if (el.classList.contains('hidden')) return;
    el.classList.add('hidden');
    cell = null;
    bus.emit('ui:pickerClosed');
  };

  const show = (x, y, html) => {
    el.innerHTML = html;
    el.classList.remove('hidden');
    const p = worldToUi(x, y);
    const box = el.getBoundingClientRect();
    const parent = root.getBoundingClientRect();
    // Prefer above the cell; flip below near the top edge; keep inside the screen.
    let top = p.y - box.height - 26 * (parent.width / 1280);
    if (top < 8) top = p.y + 26 * (parent.width / 1280);
    const left = Math.min(Math.max(8, p.x - box.width / 2), parent.width - box.width - 8);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };

  bus.on('state:changed', (s) => (state = s));

  bus.on('cell:tapped', (c) => {
    if (!state) return;
    cell = c;
    const owned = eraTrapIds(state.era).filter((id) => state.inventory[id] > 0);
    if (!owned.length) {
      show(c.x, c.y, `<div class="picker-empty">Inventory empty — open the Shop</div>
        <button class="btn btn-orange btn-small" data-act="shop">Open Shop</button>`);
      return;
    }
    show(
      c.x,
      c.y,
      `<div class="picker-row">${owned
        .map((id) => `<button class="pick" data-pick="${id}" title="${trapDef(id).name}"><img src="${trapIcons[id] ?? ''}" alt="" /><span class="pick-count">${state.inventory[id]}</span></button>`)
        .join('')}</div>`,
    );
  });

  bus.on('cell:info', (c) => {
    cell = null;
    show(c.x, c.y, `<div class="picker-info"><b>${c.name}</b><span>${c.usesLeft}/${c.uses} uses left</span></div>`);
  });

  el.addEventListener('click', (e) => {
    const pick = e.target.closest('[data-pick]');
    if (pick && cell) {
      bus.emit('ui:placeTrap', { trapId: pick.dataset.pick, col: cell.col, row: cell.row });
      el.classList.add('hidden');
      cell = null;
    }
    if (e.target.closest('[data-act="shop"]')) {
      close();
      bus.emit('ui:openShop');
    }
  });

  // Any tap outside the picker closes it (a new path-cell tap reopens it right after).
  document.addEventListener('pointerdown', (e) => {
    if (!el.contains(e.target)) close();
  }, true);

  bus.on('cell:none', close);
  bus.on('scene:menu', close);
  bus.on('game:over', close);
}
