import { bus } from '../bus.js';

// Pause overlay shown while the game is paused (HUD pause button, P, or Esc).
export function initPause(root) {
  const el = document.createElement('div');
  el.className = 'modal pause hidden';
  el.innerHTML = `
    <div class="card stats-card pause-card">
      <div class="stats-title">Paused</div>
      <div class="stats-sub">Take a breather — your castle will wait.</div>
      <div class="stats-buttons">
        <button class="btn btn-green" data-act="resume">Resume</button>
        <button class="btn btn-blue" data-act="menu">Main Menu</button>
      </div>
    </div>`;
  root.appendChild(el);
  let inGame = false;

  el.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'resume') bus.emit('ui:pause');
    if (act === 'menu') bus.emit('ui:menu');
  });

  document.addEventListener('keydown', (e) => {
    if (!inGame || e.repeat) return;
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') bus.emit('ui:pause');
  });

  bus.on('game:paused', (paused) => el.classList.toggle('hidden', !paused));
  bus.on('scene:game', () => {
    inGame = true;
    el.classList.add('hidden');
  });
  bus.on('scene:menu', () => {
    inGame = false;
    el.classList.add('hidden');
  });
  bus.on('game:over', () => (inGame = false));
}
