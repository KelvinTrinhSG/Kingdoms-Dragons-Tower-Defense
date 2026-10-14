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

  // era-specific road surface
  if (era === 3) {
    // cobblestones
    ctx.strokeStyle = shade(pal.path, -0.22);
    ctx.lineWidth = 1.2;
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        if (!isPathCell(col, row)) continue;
        for (let k = 0; k < 4; k++) {
          ellipse(ctx, col * CELL + 10 + (k % 2) * 20, row * CELL + 10 + Math.floor(k / 2) * 20, 8, 7);
          ctx.stroke();
        }
      }
    }
  }
  if (era === 5) {
    // dashed centre lines on the asphalt
    ctx.strokeStyle = '#ffd23a';
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 14]);
    Object.values(PATHS).forEach((p) => {
      const x0 = p.c0 * CELL;
      const y0 = p.r0 * CELL;
      const x1 = (p.c1 + 1) * CELL;
      const y1 = (p.r1 + 1) * CELL;
      ctx.beginPath();
      if (x1 - x0 < y1 - y0) {
        ctx.moveTo((x0 + x1) / 2, y0);
        ctx.lineTo((x0 + x1) / 2, y1);
      } else {
        ctx.moveTo(x0, (y0 + y1) / 2);
        ctx.lineTo(x1, (y0 + y1) / 2);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);
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

// ---- shared decoration templates ----

function roundTree(ctx, leaf, trunk = '#7a4a22', tall = 0) {
  dropShadow(ctx, 40, 94, 26, 6);
  ctx.beginPath();
  ctx.roundRect(35, 58 - tall, 10, 36 + tall, 3);
  paint(ctx, trunk, 58 - tall, 94, 2.5);
  [[40, 38 - tall, 26], [24, 50 - tall, 17], [56, 50 - tall, 17]].forEach(([x, y, r]) => {
    ellipse(ctx, x, y, r, r * 0.9);
    paint(ctx, leaf, y - r, y + r, 3);
  });
  ellipse(ctx, 40, 44 - tall, 22, 16);
  ctx.fillStyle = leaf;
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ellipse(ctx, 32, 30 - tall, 9, 6);
  ctx.fill();
}

function pineTree(ctx, leaf) {
  dropShadow(ctx, 40, 94, 20, 5);
  ctx.beginPath();
  ctx.rect(36, 76, 8, 18);
  paint(ctx, '#6b4423', 76, 94, 2.5);
  [[80, 30], [62, 24], [44, 18]].forEach(([y, hw], i) => {
    poly(ctx, [[40 - hw, y], [40, y - 30 + i * 2], [40 + hw, y]]);
    paint(ctx, leaf, y - 30, y, 3);
  });
}

function roundBush(ctx, leaf) {
  dropShadow(ctx, 25, 35, 20, 4);
  [[16, 26, 10], [34, 26, 10], [25, 20, 12]].forEach(([x, y, r]) => {
    ellipse(ctx, x, y, r, r * 0.85);
    paint(ctx, leaf, y - r, y + r, 2.5);
  });
}

function stones(ctx, color) {
  dropShadow(ctx, 28, 37, 25, 4);
  [[18, 30, 12, 8], [34, 31, 10, 7], [27, 24, 9, 7]].forEach(([x, y, rx, ry]) => {
    ellipse(ctx, x, y, rx, ry);
    paint(ctx, color, y - ry, y + ry, 2.5);
  });
  shine(ctx, 22, 19, 29, 18, 2);
}

function hut(ctx, wall, roof, stone = false) {
  dropShadow(ctx, 35, 64, 30, 6);
  ctx.beginPath();
  ctx.rect(12, 34, 46, 30);
  paint(ctx, wall, 34, 64, 3);
  ctx.strokeStyle = 'rgba(43,29,18,0.35)';
  ctx.lineWidth = 1.5;
  for (let y = 40; y < 64; y += 6) {
    ctx.beginPath();
    ctx.moveTo(13, y);
    ctx.lineTo(57, y);
    ctx.stroke();
    if (stone) {
      for (let x = 18 + ((y / 6) % 2) * 5; x < 57; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, y - 6);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  }
  poly(ctx, [[6, 36], [35, 10], [64, 36]]);
  paint(ctx, roof, 10, 36, 3);
  shine(ctx, 31, 16, 14, 32, 2.5, 0.3);
  ctx.beginPath();
  ctx.roundRect(29, 46, 12, 18, [6, 6, 0, 0]);
  flat(ctx, '#3a2614', 2.5);
}

const ERA_DECOR_MORE = {
  2: {
    tree: (ctx) => roundTree(ctx, '#4f9a3a'),
    bush: (ctx) => roundBush(ctx, '#5ea844'),
    rock: (ctx) => stones(ctx, '#9a8f82'),
    building: (ctx) => hut(ctx, '#a8743e', '#d9b45a'),
  },
  3: {
    tree: (ctx) => pineTree(ctx, '#2f6b3a'),
    bush: (ctx) => roundBush(ctx, '#3f7f3a'),
    rock: (ctx) => stones(ctx, '#a9adb3'),
    building: (ctx) => hut(ctx, '#b9ad97', '#b33a2a', true),
  },
  4: {
    tree: (ctx) => roundTree(ctx, '#6f8a3a', '#6b4a2b', 6),
    bush: (ctx) => roundBush(ctx, '#7a9440'),
    rock(ctx) {
      // a parked field cannon
      dropShadow(ctx, 28, 37, 25, 4);
      ctx.save();
      ctx.translate(26, 30);
      ctx.rotate(-0.25);
      ctx.beginPath();
      ctx.roundRect(-6, -6, 30, 10, 5);
      paint(ctx, '#2f3338', -6, 4, 2.5);
      ctx.restore();
      ellipse(ctx, 22, 31, 8, 8);
      flat(ctx, '#8b5a2b', 2.5);
      ellipse(ctx, 22, 31, 2.5, 2.5);
      flat(ctx, '#3a2614', 1.5);
    },
    building(ctx) {
      // canvas army tent
      dropShadow(ctx, 35, 64, 30, 6);
      poly(ctx, [[6, 64], [20, 26], [50, 26], [64, 64]]);
      paint(ctx, '#d8cfae', 26, 64, 3);
      poly(ctx, [[20, 26], [35, 64], [6, 64]]);
      paint(ctx, '#c2b68e', 26, 64, 2.5);
      poly(ctx, [[30, 64], [35, 40], [40, 64]]);
      flat(ctx, '#3a2614', 2.5);
      ctx.beginPath();
      ctx.rect(33.5, 14, 3, 14);
      flat(ctx, '#5a3418', 2);
    },
  },
  5: {
    tree: (ctx) => roundTree(ctx, '#3d6e33', '#55483a'),
    bush: (ctx) => roundBush(ctx, '#4a7a3a'),
    rock(ctx) {
      // sandbag pile
      dropShadow(ctx, 28, 37, 26, 4);
      [[12, 32], [28, 32], [44, 32], [20, 23], [36, 23], [28, 14]].forEach(([x, y]) => {
        ellipse(ctx, x, y, 9, 5.5);
        paint(ctx, '#c2b280', y - 6, y + 6, 2);
      });
    },
    building(ctx) {
      // concrete bunker
      dropShadow(ctx, 35, 64, 32, 6);
      ctx.beginPath();
      ctx.roundRect(6, 28, 58, 36, [18, 18, 4, 4]);
      paint(ctx, '#8a9099', 28, 64, 3);
      ctx.beginPath();
      ctx.rect(18, 40, 34, 7);
      flat(ctx, '#1f2937', 2.5);
      ctx.beginPath();
      ctx.rect(30, 14, 3, 16);
      flat(ctx, '#4b5563', 2);
      poly(ctx, [[33, 15], [46, 19], [33, 23]]);
      paint(ctx, '#35ec00', 15, 23, 2);
    },
  },
};

Object.assign(ERA_DECOR, ERA_DECOR_MORE);

export const DECOR_SIZES ={ tree: [80, 100], bush: [50, 40], rock: [56, 42], building: [70, 70] };

export function makeEraTextures(scene, era) {
  makeTexture(scene, `map-${era}`, WIDTH, HEIGHT, (ctx) => drawMap(ctx, era));
  const decor = ERA_DECOR[era];
  if (!decor) return;
  Object.entries(DECOR_SIZES).forEach(([kind, [w, h]]) => {
    makeTexture(scene, `${kind}-${era}`, w, h, decor[kind]);
  });
}

export const ERAS_WITH_ART = Object.keys(ERA_DECOR).map(Number);
