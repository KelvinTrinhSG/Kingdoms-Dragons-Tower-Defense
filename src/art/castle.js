import { makeTexture, paint, flat, poly, ellipse, dropShadow, shine, OUTLINE } from './palette.js';

// One drawing function per era. Each texture is 220x220; the castle's ground line sits near y=185.
export const CASTLE_SIZE = 220;

function torch(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x - 3, y);
  ctx.lineTo(x + 3, y);
  ctx.lineTo(x + 2, y + 30);
  ctx.lineTo(x - 2, y + 30);
  ctx.closePath();
  flat(ctx, '#7a4a22', 2.5);
  // flame
  ctx.beginPath();
  ctx.moveTo(x, y - 20);
  ctx.quadraticCurveTo(x + 10, y - 6, x + 6, y + 1);
  ctx.quadraticCurveTo(x, y + 4, x - 6, y + 1);
  ctx.quadraticCurveTo(x - 10, y - 6, x, y - 20);
  const g = ctx.createLinearGradient(0, y - 20, 0, y + 2);
  g.addColorStop(0, '#ffe066');
  g.addColorStop(1, '#ff6b0a');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = OUTLINE;
  ctx.stroke();
}

function stake(ctx, x, yTop, yBottom, w = 9) {
  poly(ctx, [
    [x - w / 2, yBottom],
    [x - w / 2, yTop + 8],
    [x, yTop],
    [x + w / 2, yTop + 8],
    [x + w / 2, yBottom],
  ]);
  paint(ctx, '#9a6332', yTop, yBottom, 2.5);
}

function tusk(ctx, x, y, dir) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + dir * 30, y - 10, x + dir * 22, y - 52);
  ctx.quadraticCurveTo(x + dir * 18, y - 18, x - dir * 8, y - 6);
  ctx.closePath();
  paint(ctx, '#f3ead2', y - 52, y, 2.5);
}

function era1(ctx) {
  dropShadow(ctx, 110, 186, 98, 22);
  // rock mound
  poly(ctx, [
    [16, 186], [22, 140], [40, 104], [62, 82], [84, 60], [112, 50], [140, 58], [164, 78],
    [184, 102], [198, 136], [204, 186],
  ]);
  paint(ctx, '#8a7f73', 50, 186, 3.5);
  // boulders on the mound
  const rocks = [[56, 110, 22, 16], [150, 98, 24, 17], [104, 72, 26, 16], [178, 146, 18, 14], [36, 150, 18, 13]];
  rocks.forEach(([x, y, rx, ry]) => {
    ellipse(ctx, x, y, rx, ry);
    paint(ctx, '#9a8f82', y - ry, y + ry, 3);
    shine(ctx, x - rx * 0.5, y - ry * 0.45, x + rx * 0.1, y - ry * 0.75, 2.5, 0.4);
  });
  // cave mouth
  ctx.beginPath();
  ctx.moveTo(74, 186);
  ctx.quadraticCurveTo(74, 112, 110, 108);
  ctx.quadraticCurveTo(146, 112, 146, 186);
  ctx.closePath();
  const cave = ctx.createLinearGradient(0, 108, 0, 186);
  cave.addColorStop(0, '#120b06');
  cave.addColorStop(1, '#3a2614');
  ctx.fillStyle = cave;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = OUTLINE;
  ctx.stroke();
  // warm glow inside
  const glow = ctx.createRadialGradient(110, 176, 2, 110, 176, 34);
  glow.addColorStop(0, 'rgba(255,158,22,0.55)');
  glow.addColorStop(1, 'rgba(255,158,22,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(76, 130, 68, 56);
  // stalactite teeth
  [[92, 120], [104, 112], [116, 112], [128, 120]].forEach(([x, y]) => {
    poly(ctx, [[x - 5, y], [x + 5, y], [x, y + 12]]);
    flat(ctx, '#b3a89a', 2);
  });
  // mammoth tusks framing the cave
  tusk(ctx, 70, 186, -1);
  tusk(ctx, 150, 186, 1);
  // banner pole and hide flag
  ctx.beginPath();
  ctx.rect(132, 16, 6, 50);
  flat(ctx, '#7a4a22', 2.5);
  poly(ctx, [[138, 20], [176, 24], [168, 36], [178, 48], [138, 46]]);
  paint(ctx, '#d9b47a', 20, 48, 2.5);
  ctx.fillStyle = '#c7141f';
  ctx.fillRect(146, 30, 18, 5);
  // palisade
  [20, 31, 42, 53, 64].forEach((x, i) => stake(ctx, x, 150 - (i % 2) * 6, 194));
  [156, 167, 178, 189, 200].forEach((x, i) => stake(ctx, x, 150 - ((i + 1) % 2) * 6, 194));
  ctx.beginPath();
  ctx.rect(14, 172, 56, 5);
  flat(ctx, '#6b4423', 2);
  ctx.beginPath();
  ctx.rect(150, 172, 56, 5);
  flat(ctx, '#6b4423', 2);
  torch(ctx, 82, 118);
  torch(ctx, 138, 118);
}

const DRAWERS = { 1: era1 };

export function makeCastleTextures(scene) {
  Object.entries(DRAWERS).forEach(([era, draw]) => {
    makeTexture(scene, `castle-${era}`, CASTLE_SIZE, CASTLE_SIZE, draw);
  });
}
