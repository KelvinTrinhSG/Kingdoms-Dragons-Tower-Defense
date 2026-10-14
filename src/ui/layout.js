// Keeps the #ui overlay exactly on top of the scaled Phaser canvas,
// and converts world coordinates (1280x800) to overlay pixels.

let rect = { left: 0, top: 0, width: 1280, height: 800 };
let scale = 1;
const listeners = [];

export function initLayout(game, root) {
  const sync = () => {
    const r = game.canvas.getBoundingClientRect();
    rect = r;
    scale = r.width / game.scale.width;
    Object.assign(root.style, {
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });
    root.style.setProperty('--ui-scale', scale);
    listeners.forEach((fn) => fn());
  };
  game.scale.on('resize', sync);
  window.addEventListener('resize', () => requestAnimationFrame(sync));
  sync();
}

export function worldToUi(x, y) {
  return { x: x * scale, y: y * scale };
}

export function onLayout(fn) {
  listeners.push(fn);
}

export function uiRect() {
  return rect;
}
