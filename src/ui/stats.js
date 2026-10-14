import { bus } from '../bus.js';

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Win / Defeat results in the Market Royale results style.
export function initStats(root) {
  const el = document.createElement('div');
  el.className = 'modal stats hidden';
  root.appendChild(el);

  el.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'again') bus.emit('ui:restart');
    if (act === 'menu') bus.emit('ui:menu');
  });

  bus.on('game:over', ({ won, timeMs, kills, money }) => {
    el.innerHTML = `
      <div class="card stats-card ${won ? 'win' : 'lose'}">
        <div class="stats-title">${won ? 'Victory!' : 'Defeat'}</div>
        <div class="stats-sub">${won ? 'Your castle survived every era.' : 'Your castle has fallen.'}</div>
        <div class="tiles">
          <div class="tile"><span class="tile-label">Time</span><span class="tile-value" data-stat="time">${formatTime(timeMs)}</span></div>
          <div class="tile"><span class="tile-label">Enemies killed</span><span class="tile-value" data-stat="kills">${kills.toLocaleString('en-US')}</span></div>
          <div class="tile"><span class="tile-label">Money left</span><span class="tile-value" data-stat="money">${money.toLocaleString('en-US')}</span></div>
        </div>
        <div class="stats-buttons">
          <button class="btn btn-green" data-act="again">Play Again</button>
          <button class="btn btn-blue" data-act="menu">Main Menu</button>
        </div>
      </div>`;
    el.classList.remove('hidden');
  });
  bus.on('scene:game', () => el.classList.add('hidden'));
  bus.on('scene:menu', () => el.classList.add('hidden'));
}
