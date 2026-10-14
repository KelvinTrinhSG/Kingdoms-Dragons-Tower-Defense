// The map: 32x20 cells of 40px (1280x800). Castle in the center, 4 straight
// paths 2 cells wide leading to it from each edge.

export const CELL = 40;
export const COLS = 32;
export const ROWS = 20;
export const WIDTH = COLS * CELL;
export const HEIGHT = ROWS * CELL;

export const CASTLE = { col: 14, row: 8, cols: 4, rows: 4 };
export const CASTLE_CENTER = {
  x: (CASTLE.col + CASTLE.cols / 2) * CELL,
  y: (CASTLE.row + CASTLE.rows / 2) * CELL,
};

// Each path as an inclusive block of cells.
export const PATHS = {
  N: { c0: 15, c1: 16, r0: 0, r1: 7 },
  S: { c0: 15, c1: 16, r0: 12, r1: 19 },
  W: { c0: 0, c1: 13, r0: 9, r1: 10 },
  E: { c0: 18, c1: 31, r0: 9, r1: 10 },
};

export function isPathCell(col, row) {
  return Object.values(PATHS).some((p) => col >= p.c0 && col <= p.c1 && row >= p.r0 && row <= p.r1);
}

export function isCastleCell(col, row) {
  return (
    col >= CASTLE.col && col < CASTLE.col + CASTLE.cols && row >= CASTLE.row && row < CASTLE.row + CASTLE.rows
  );
}

export function cellAt(x, y) {
  const col = Math.floor(x / CELL);
  const row = Math.floor(y / CELL);
  if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return null;
  return { col, row };
}

export function cellCenter(col, row) {
  return { x: col * CELL + CELL / 2, y: row * CELL + CELL / 2 };
}

// Two lanes per direction (one per path column/row), from just off-screen to the castle wall.
const OFF = 30;
const castleTop = CASTLE.row * CELL;
const castleBottom = (CASTLE.row + CASTLE.rows) * CELL;
const castleLeft = CASTLE.col * CELL;
const castleRight = (CASTLE.col + CASTLE.cols) * CELL;

export const LANES = [
  ...[15, 16].map((c, i) => ({ dir: 'N', lane: i, points: [{ x: cellCenter(c, 0).x, y: -OFF }, { x: cellCenter(c, 0).x, y: castleTop }] })),
  ...[15, 16].map((c, i) => ({ dir: 'S', lane: i, points: [{ x: cellCenter(c, 0).x, y: HEIGHT + OFF }, { x: cellCenter(c, 0).x, y: castleBottom }] })),
  ...[9, 10].map((r, i) => ({ dir: 'W', lane: i, points: [{ x: -OFF, y: cellCenter(0, r).y }, { x: castleLeft, y: cellCenter(0, r).y }] })),
  ...[9, 10].map((r, i) => ({ dir: 'E', lane: i, points: [{ x: WIDTH + OFF, y: cellCenter(0, r).y }, { x: castleRight, y: cellCenter(0, r).y }] })),
];
