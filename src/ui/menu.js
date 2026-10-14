import { bus } from '../bus.js';

// Main Menu: logo wordmark, PLAY, HOW TO PLAY.
export function initMenu(root) {
  const el = document.createElement('div');
  el.className = 'screen menu hidden';
  el.innerHTML = `
    <div class="logo">
      <span class="logo-top">Kingdoms &amp; Dragons</span>
      <span class="logo-bottom">Tower Defense</span>
    </div>
    <div class="menu-buttons">
      <button class="btn btn-green btn-big" data-act="play">Play</button>
      <button class="btn btn-blue" data-act="how">How to Play</button>
    </div>
    <div class="modal hidden" data-el="how">
      <div class="card how-card">
        <h2>How to Play</h2>
        <ol>
          <li><b>Click the castle</b> to earn money.</li>
          <li><b>Tap a path cell</b> and pick a trap — it's bought and placed in one tap. Enemies come from all 4 sides.</li>
          <li>Or stock up on traps in the <b>Shop</b>.</li>
          <li>Killed enemies drop <b>stone, wood, and gold</b>.</li>
          <li>Press <b>Upgrade</b> to evolve your castle into the next era.</li>
          <li>Survive Wave 20 of the Modern era to win!</li>
        </ol>
        <button class="btn btn-green" data-act="close">Got it</button>
      </div>
    </div>`;
  root.appendChild(el);

  const how = el.querySelector('[data-el="how"]');
  el.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'play') bus.emit('ui:play');
    if (act === 'how') how.classList.remove('hidden');
    if (act === 'close') how.classList.add('hidden');
  });

  bus.on('scene:menu', () => el.classList.remove('hidden'));
  bus.on('scene:game', () => {
    el.classList.add('hidden');
    how.classList.add('hidden');
  });
}
