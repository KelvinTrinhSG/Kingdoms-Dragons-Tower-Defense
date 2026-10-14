import { artImage, rng } from '../art/palette.js';
import { CASTLE_CENTER, CELL, COLS, ROWS, WIDTH, HEIGHT, isPathCell } from './grid.js';

// Decoration spots are fixed for every era, so an upgrade swaps art in place.
function buildLayout() {
  const rand = rng(7);
  const spots = [];
  const blocked = (col, row) => {
    for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) if (isPathCell(col + dc, row + dr)) return true;
    const { x, y } = { x: col * CELL + CELL / 2, y: row * CELL + CELL / 2 };
    return Math.abs(x - CASTLE_CENTER.x) < 150 && Math.abs(y - CASTLE_CENTER.y) < 150;
  };
  for (let tries = 0; tries < 2000 && spots.length < 54; tries++) {
    const col = Math.floor(rand() * COLS);
    const row = Math.floor(rand() * ROWS);
    if (blocked(col, row)) continue;
    const x = col * CELL + CELL / 2 + (rand() - 0.5) * 16;
    const y = row * CELL + CELL - 4 + (rand() - 0.5) * 8;
    if (spots.some((s) => Math.hypot(s.x - x, s.y - y) < 62)) continue;
    const r = rand();
    const kind = r < 0.42 ? 'tree' : r < 0.67 ? 'bush' : r < 0.85 ? 'rock' : 'building';
    spots.push({ kind, x, y });
  }
  return spots;
}

const LAYOUT = buildLayout();

// The castle texture is drawn with its ground line near y=185 of 220.
const CASTLE_ORIGIN_Y = 0.6;

export function buildWorld(scene, era) {
  const ground = artImage(scene, WIDTH / 2, HEIGHT / 2, `map-${era}`).setDepth(-1000);
  const decor = LAYOUT.map((s) => artImage(scene, s.x, s.y, `${s.kind}-${era}`).setOrigin(0.5, 0.94).setDepth(s.y));
  const castle = artImage(scene, CASTLE_CENTER.x, CASTLE_CENTER.y, `castle-${era}`)
    .setOrigin(0.5, CASTLE_ORIGIN_Y)
    .setDepth(CASTLE_CENTER.y + 80);

  return {
    ground,
    decor,
    castle,
    setEra(next) {
      ground.setTexture(`map-${next}`);
      decor.forEach((img, i) => img.setTexture(`${LAYOUT[i].kind}-${next}`));
      castle.setTexture(`castle-${next}`);
    },
  };
}
