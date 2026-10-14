import { makeTexture, paint, flat, poly, ellipse, dropShadow, shade, shine, rng, roundRect, ERA_PALETTES, OUTLINE } from './palette.js';
import { WIDTH, HEIGHT, CELL, COLS, ROWS, PATHS, isPathCell } from '../world/grid.js';

// ---- Map ground (one big texture per era) ----

const PLAZA = { x: 544, y: 304, w: 192, h: 192, r: 36 };

function pathRects(inflate = 0) {
  return Object.values(PATHS).map((p) => ({
    x: p.c0 * CELL - inflate,
    y: p.r0 * CELL - inflate,
    w: (p.c1 - p.c0 + 1) * CELL + inflate * 2,
    h: (p.r1 - p.r0 + 1) * CELL + inflate * 2,
  }));
}

function drawMap(ctx, era) {
  const pal = ERA_PALETTES[era];
  const rand = rng(1000 + era);

  ctx.fillStyle = pal.ground;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  // soft blotches
  for (let i = 0; i < 170; i++) {
    const x = rand() * WIDTH;
    const y = rand() * HEIGHT;
    ctx.fillStyle = shade(pal.ground, rand() < 0.5 ? -0.08 : 0.08);
    ctx.globalAlpha = 0.55;
    ellipse(ctx, x, y, 20 + rand() * 50, 12 + rand() * 30);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  // grass tufts
  ctx.strokeStyle = shade(pal.ground, -0.28);
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  for (let i = 0; i < 520; i++) {
    const x = rand() * WIDTH;
    const y = rand() * HEIGHT;
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 4);
    ctx.lineTo(x, y + 1);
    ctx.lineTo(x + 3, y - 5);
    ctx.stroke();
  }

  // path border, then path fill
  ctx.fillStyle = shade(pal.path, -0.38);
  pathRects(5).forEach((r) => ctx.fillRect(r.x, r.y, r.w, r.h));
  roundRect(ctx, PLAZA.x - 5, PLAZA.y - 5, PLAZA.w + 10, PLAZA.h + 10, PLAZA.r + 5);
  ctx.fill();
  ctx.fillStyle = pal.path;
  pathRects(0).forEach((r) => ctx.fillRect(r.x, r.y, r.w, r.h));
  roundRect(ctx, PLAZA.x, PLAZA.y, PLAZA.w, PLAZA.h, PLAZA.r);
  ctx.fill();

  // path texture: pebbles and worn tracks
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (!isPathCell(col, row)) continue;
      for (let k = 0; k < 3; k++) {
        const x = col * CELL + 4 + rand() * (CELL - 8);
        const y = row * CELL + 4 + rand() * (CELL - 8);
        ctx.fillStyle = shade(pal.path, rand() < 0.5 ? -0.18 : 0.16);
        ellipse(ctx, x, y, 1.5 + rand() * 2.5, 1 + rand() * 1.8);
        ctx.fill();
      }
    }
  }

  // grid: faint everywhere, clearer on the paths where traps go
  ctx.strokeStyle = 'rgba(43, 29, 18, 0.05)';
  ctx.lineWidth = 1;
  for (let c = 1; c < COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * CELL, 0);
    ctx.lineTo(c * CELL, HEIGHT);
    ctx.stroke();
  }
  for (let r = 1; r < ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * CELL);
    ctx.lineTo(WIDTH, r * CELL);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(43, 29, 18, 0.16)';
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (isPathCell(col, row)) ctx.strokeRect(col * CELL + 0.5, row * CELL + 0.5, CELL - 1, CELL - 1);
    }
  }
}

// ---- Decorations: tree, bush, rock, building per era. Base of each sits at the bottom center. ----

const ERA_DECOR = {
  1: {
    tree(ctx) {
      dropShadow(ctx, 40, 94, 22, 6);
      // segmented trunk
      for (let i = 0; i < 5; i++) {
        const y = 92 - i * 11;
        poly(ctx, [[33 + i, y], [47 - i, y], [46 - i, y - 12], [34 + i, y - 12]]);
        paint(ctx, '#8b5a2b', y - 12, y, 2.5);
      }
      // fronds
      const leaf = (angle, len) => {
        ctx.save();
        ctx.translate(40, 38);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(len * 0.5, -12, len, 4);
        ctx.quadraticCurveTo(len * 0.5, 6, 0, 0);
        paint(ctx, '#5f8f3a', -12, 6, 2.5);
        ctx.restore();
      };
      [-2.7, -2.1, -1.57, -1.0, -0.4, 0.25, 2.9].forEach((a, i) => leaf(a, 34 + (i % 2) * 6));
      ellipse(ctx, 40, 38, 7, 6);
      flat(ctx, '#6b4423', 2);
    },
    bush(ctx) {
      dropShadow(ctx, 25, 33, 20, 4);
      [-0.9, -0.45, 0, 0.45, 0.9].forEach((a) => {
        ctx.save();
        ctx.translate(25, 33);
        ctx.rotate(a - Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(14, -7, 28, 0);
        ctx.quadraticCurveTo(14, 7, 0, 0);
        paint(ctx, '#6f9e3a', -7, 7, 2);
        ctx.restore();
      });
    },
    rock(ctx) {
      dropShadow(ctx, 28, 36, 26, 5);
      ellipse(ctx, 22, 26, 16, 12);
      paint(ctx, '#8a7f73', 14, 38, 3);
      ellipse(ctx, 38, 30, 12, 9);
      paint(ctx, '#9a8f82', 21, 39, 3);
      shine(ctx, 13, 20, 22, 17, 2.5);
    },
    building(ctx) {
      // hide tent
      dropShadow(ctx, 35, 64, 30, 6);
      [[24, 8, 30, 30], [46, 8, 40, 30]].forEach(([x0, y0, x1, y1]) => {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineWidth = 3;
        ctx.strokeStyle = OUTLINE;
        ctx.stroke();
      });
      poly(ctx, [[35, 14], [62, 64], [8, 64]]);
      paint(ctx, '#c9a06b', 14, 64, 3);
      poly(ctx, [[35, 14], [44, 64], [26, 64]]);
      paint(ctx, '#b48552', 14, 64, 0);
      poly(ctx, [[35, 40], [42, 64], [28, 64]]);
      flat(ctx, '#2a1a0c', 2.5);
      ctx.strokeStyle = 'rgba(43,29,18,0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(22, 40);
      ctx.lineTo(16, 58);
      ctx.moveTo(48, 40);
      ctx.lineTo(54, 58);
      ctx.stroke();
      ctx.setLineDash([]);
    },
  },
};

export const DECOR_SIZES = { tree: [80, 100], bush: [50, 40], rock: [56, 42], building: [70, 70] };

export function makeEraTextures(scene, era) {
  makeTexture(scene, `map-${era}`, WIDTH, HEIGHT, (ctx) => drawMap(ctx, era));
  const decor = ERA_DECOR[era];
  if (!decor) return;
  Object.entries(DECOR_SIZES).forEach(([kind, [w, h]]) => {
    makeTexture(scene, `${kind}-${era}`, w, h, decor[kind]);
  });
}

export const ERAS_WITH_ART = Object.keys(ERA_DECOR).map(Number);
