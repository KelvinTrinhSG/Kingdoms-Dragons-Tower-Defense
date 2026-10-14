import { bus } from '../bus.js';
import { eraTrapIds, trapDef } from '../data/eras.js';
import { ICONS, trapIcons } from './icons.js';
import { worldToUi } from './layout.js';

// The trap picker that pops up at a tapped path cell.
export function initPicker(root) {
  const el = document.createElement('div');
  el.className = 'picker card hidden';
  root.appendChild(el);
  let state = null;
  let cell = null;
  let lastHtml = '';

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

  // All 3 current-era traps. Owned ones show their count and place for free;
  // the rest show their price and are bought on the spot, dimmed when unaffordable.
  const renderTraps = () => {
    const ids = eraTrapIds(state.era);
    const buttons = ids
      .map((id) => {
        const t = trapDef(id);
        const owned = state.inventory[id] > 0;
        const ok = owned || state.money >= t.price;
        const badge = owned
          ? `<span class="pick-count">${state.inventory[id]}</span>`
          : `<span class="pick-price"><i class="icon">${ICONS.money}</i>${t.price}</span>`;
        return `<button class="pick" data-pick="${id}" title="${t.name}" ${ok ? '' : 'disabled'}><img src="${trapIcons[id] ?? ''}" alt="" />${badge}</button>`;
      })
      .join('');
    const stuck = ids.every((id) => !(state.inventory[id] > 0) && state.money < trapDef(id).price);
    const hint = stuck ? '<div class="picker-empty">Not enough money — tap the castle to earn more!</div>' : '';
    const html = `<div class="picker-row">${buttons}</div>${hint}`;
    // Only rebuild when something visible changed, so a press mid-update isn't lost.
    if (html === lastHtml && !el.classList.contains('hidden')) return;
    lastHtml = html;
    show(cell.x, cell.y, html);
  };

  bus.on('state:changed', (s) => {
    state = s;
    // Keep an open picker in step with money (castle clicks, kills) while it's up.
    if (cell && !el.classList.contains('hidden')) renderTraps();
  });

  bus.on('cell:tapped', (c) => {
    if (!state) return;
    cell = c;
    renderTraps();
  });

  bus.on('cell:info', (c) => {
    cell = null;
    show(c.x, c.y, `<div class="picker-info"><b>${c.name}</b><span>${c.usesLeft}/${c.uses} uses left</span></div>`);
  });

  el.addEventListener('click', (e) => {
    const pick = e.target.closest('[data-pick]');
    if (pick && !pick.disabled && cell) {
      const { col, row } = cell;
      el.classList.add('hidden');
      cell = null;
      bus.emit('ui:placeTrap', { trapId: pick.dataset.pick, col, row });
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
