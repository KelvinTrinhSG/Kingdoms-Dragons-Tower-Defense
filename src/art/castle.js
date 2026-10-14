import { makeTexture, paint, flat, poly, ellipse, dropShadow, shine, shade as shadeColor, OUTLINE } from './palette.js';

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

// ---- shared castle parts ----

function box(ctx, x, y, w, h, color, lw = 3) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  paint(ctx, color, y, y + h, lw);
}

function crenels(ctx, x, y, w, color, size = 8) {
  for (let cx = x; cx < x + w - 1; cx += size * 2) {
    box(ctx, cx, y - size, Math.min(size, x + w - cx), size, color, 2.5);
  }
}

function cone(ctx, cx, yBase, w, h, color) {
  poly(ctx, [[cx - w / 2, yBase], [cx, yBase - h], [cx + w / 2, yBase]]);
  paint(ctx, color, yBase - h, yBase, 3);
  shine(ctx, cx - 3, yBase - h + 8, cx - w / 4, yBase - 6, 2.5, 0.35);
}

function flag(ctx, x, y, color, h = 30) {
  ctx.beginPath();
  ctx.rect(x - 1.5, y, 3, h);
  flat(ctx, '#5a3418', 2);
  poly(ctx, [[x + 1.5, y + 1], [x + 22, y + 6], [x + 1.5, y + 12]]);
  paint(ctx, color, y, y + 12, 2);
}

function plankLines(ctx, x, y, w, h, step, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  for (let px = x + step; px < x + w; px += step) {
    ctx.beginPath();
    ctx.moveTo(px, y + 2);
    ctx.lineTo(px, y + h - 2);
    ctx.stroke();
  }
}

function brickLines(ctx, x, y, w, h, color, bh = 7, bw = 14) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  for (let row = 0, py = y + bh; py < y + h; py += bh, row++) {
    ctx.beginPath();
    ctx.moveTo(x, py);
    ctx.lineTo(x + w, py);
    ctx.stroke();
    for (let px = x + (row % 2 ? bw / 2 : 0); px < x + w; px += bw) {
      ctx.beginPath();
      ctx.moveTo(px, py - bh);
      ctx.lineTo(px, py);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function archGate(ctx, cx, yBottom, w, h, fill = '#2a1a0c') {
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, yBottom);
  ctx.lineTo(cx - w / 2, yBottom - h + w / 2);
  ctx.arc(cx, yBottom - h + w / 2, w / 2, Math.PI, 0);
  ctx.lineTo(cx + w / 2, yBottom);
  ctx.closePath();
  flat(ctx, fill, 3);
}

// ---- Era 2: Wooden Fort ----
function era2(ctx) {
  dropShadow(ctx, 110, 188, 100, 20);
  // keep
  box(ctx, 70, 78, 80, 70, '#a8743e');
  plankLines(ctx, 70, 78, 80, 70, 10, 'rgba(43,29,18,0.35)');
  poly(ctx, [[60, 82], [110, 40], [160, 82]]);
  paint(ctx, '#c7141f', 40, 82, 3);
  shine(ctx, 104, 50, 74, 76, 3, 0.3);
  flag(ctx, 110, 10, '#fff04d');
  ellipse(ctx, 110, 98, 9, 9);
  flat(ctx, '#3a2614', 2.5);
  // watchtowers
  [[30, 70], [190, 70]].forEach(([x, y]) => {
    box(ctx, x - 14, y, 28, 110, '#8b5a2b');
    plankLines(ctx, x - 14, y, 28, 110, 7, 'rgba(43,29,18,0.35)');
    box(ctx, x - 19, y - 6, 38, 12, '#a8743e', 2.5);
    poly(ctx, [[x - 22, y - 6], [x, y - 34], [x + 22, y - 6]]);
    paint(ctx, '#b33a2a', y - 34, y - 6, 3);
  });
  // palisade wall
  for (let x = 16; x <= 204; x += 10) {
    poly(ctx, [[x - 5, 192], [x - 5, 140], [x, 132], [x + 5, 140], [x + 5, 192]]);
    paint(ctx, '#9a6332', 132, 192, 2.5);
  }
  box(ctx, 12, 160, 196, 6, '#6b4423', 2);
  // gate
  ctx.beginPath();
  ctx.roundRect(88, 136, 44, 56, [20, 20, 0, 0]);
  paint(ctx, '#6b4423', 136, 192, 3);
  plankLines(ctx, 88, 140, 44, 52, 8, 'rgba(43,29,18,0.5)');
  box(ctx, 88, 160, 44, 4, '#3a2614', 2);
}

// ---- Era 3: Stone Castle ----
function era3(ctx) {
  dropShadow(ctx, 110, 188, 102, 20);
  const stone = '#a9adb3';
  // keep
  box(ctx, 66, 62, 88, 90, stone);
  brickLines(ctx, 66, 62, 88, 90, 'rgba(43,29,18,0.22)', 9, 18);
  crenels(ctx, 66, 62, 88, stone);
  flag(ctx, 110, 10, '#1259e0', 30);
  [[90, 92], [130, 92]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.roundRect(x - 5, y - 9, 10, 18, [5, 5, 0, 0]);
    flat(ctx, '#2a1a0c', 2);
  });
  // towers
  [[32, 64], [188, 64]].forEach(([x, y]) => {
    box(ctx, x - 20, y, 40, 124, shadeColor(stone, -0.05));
    brickLines(ctx, x - 20, y, 40, 124, 'rgba(43,29,18,0.22)', 9, 16);
    cone(ctx, x, y + 2, 50, 44, '#1259e0');
    ctx.beginPath();
    ctx.roundRect(x - 4, y + 30, 8, 14, [4, 4, 0, 0]);
    flat(ctx, '#2a1a0c', 2);
  });
  // front wall
  box(ctx, 18, 140, 184, 52, stone);
  brickLines(ctx, 18, 140, 184, 52, 'rgba(43,29,18,0.22)', 9, 18);
  crenels(ctx, 18, 140, 184, stone);
  // gate with portcullis
  archGate(ctx, 110, 192, 40, 46);
  ctx.strokeStyle = '#6b6f75';
  ctx.lineWidth = 2.5;
  for (let x = 96; x <= 124; x += 7) {
    ctx.beginPath();
    ctx.moveTo(x, 150);
    ctx.lineTo(x, 190);
    ctx.stroke();
  }
  for (let y = 158; y < 190; y += 9) {
    ctx.beginPath();
    ctx.moveTo(91, y);
    ctx.lineTo(129, y);
    ctx.stroke();
  }
  // banners
  [[56, 150], [164, 150]].forEach(([x, y]) => {
    poly(ctx, [[x - 8, y], [x + 8, y], [x + 8, y + 26], [x, y + 20], [x - 8, y + 26]]);
    paint(ctx, '#c7141f', y, y + 26, 2);
  });
}

// ---- Era 4: Pre-modern Barracks ----
function era4(ctx) {
  dropShadow(ctx, 110, 190, 104, 20);
  const brick = '#9c4a33';
  // main hall
  box(ctx, 34, 82, 152, 80, brick);
  brickLines(ctx, 34, 82, 152, 80, 'rgba(43,29,18,0.25)');
  poly(ctx, [[26, 86], [56, 52], [164, 52], [194, 86]]);
  paint(ctx, '#4b5563', 52, 86, 3);
  shine(ctx, 60, 58, 150, 58, 3, 0.3);
  // clock tower
  box(ctx, 92, 18, 36, 40, '#b5654a');
  poly(ctx, [[88, 20], [110, 2], [132, 20]]);
  paint(ctx, '#4b5563', 2, 20, 2.5);
  ellipse(ctx, 110, 36, 9, 9);
  flat(ctx, '#f3ead2', 2);
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(110, 36);
  ctx.lineTo(110, 30);
  ctx.moveTo(110, 36);
  ctx.lineTo(115, 37);
  ctx.stroke();
  // windows
  [52, 76, 144, 168].forEach((x) => {
    ctx.beginPath();
    ctx.roundRect(x - 7, 98, 14, 20, [7, 7, 0, 0]);
    flat(ctx, '#f6e7a8', 2.5);
    ctx.beginPath();
    ctx.moveTo(x, 98);
    ctx.lineTo(x, 118);
    ctx.stroke();
  });
  // door
  ctx.beginPath();
  ctx.roundRect(94, 116, 32, 46, [16, 16, 0, 0]);
  paint(ctx, '#5a3418', 116, 162, 3);
  // low star-fort wall
  poly(ctx, [[10, 192], [20, 158], [70, 166], [110, 152], [150, 166], [200, 158], [210, 192]]);
  paint(ctx, '#b9ad97', 152, 192, 3);
  // regimental flag (fictional colors)
  ctx.beginPath();
  ctx.rect(188.5, 20, 3, 66);
  flat(ctx, '#5a3418', 2);
  [['#1259e0', 0], ['#fff04d', 8], ['#1259e0', 16]].forEach(([c, dx]) => {
    ctx.fillStyle = c;
    ctx.fillRect(191 + dx, 22, 8, 16);
  });
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 2;
  ctx.strokeRect(191, 22, 24, 16);
  // cannons
  [[44, 176, 1], [176, 176, -1]].forEach(([x, y, d]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(d, 1);
    ctx.beginPath();
    ctx.roundRect(-4, -12, 26, 9, 4);
    paint(ctx, '#2f3338', -12, -3, 2.5);
    ellipse(ctx, 0, 0, 8, 8);
    flat(ctx, '#8b5a2b', 2.5);
    ctx.restore();
  });
}

// ---- Era 5: Modern Barracks ----
function era5(ctx) {
  dropShadow(ctx, 110, 190, 104, 20);
  const steel = '#6b7280';
  // main block
  box(ctx, 30, 84, 160, 80, '#8a9099');
  box(ctx, 24, 76, 172, 12, steel);
  [48, 78, 142, 172].forEach((x) => {
    ctx.beginPath();
    ctx.rect(x - 9, 102, 18, 10);
    flat(ctx, '#7dd3fc', 2.5);
  });
  // command tower
  box(ctx, 82, 36, 56, 44, '#9aa1aa');
  box(ctx, 76, 30, 68, 9, steel);
  ctx.beginPath();
  ctx.rect(90, 48, 40, 12);
  flat(ctx, '#7dd3fc', 2.5);
  // radar dish
  ctx.beginPath();
  ctx.rect(160, 30, 4, 48);
  flat(ctx, '#4b5563', 2);
  ctx.beginPath();
  ctx.ellipse(162, 26, 18, 9, -0.4, 0, Math.PI);
  paint(ctx, '#d1d5db', 17, 35, 2.5);
  // antenna + flag
  ctx.beginPath();
  ctx.rect(108.5, 4, 3, 28);
  flat(ctx, '#4b5563', 2);
  poly(ctx, [[112, 6], [134, 11], [112, 16]]);
  paint(ctx, '#35ec00', 6, 16, 2);
  // blast door
  ctx.beginPath();
  ctx.rect(92, 120, 36, 44);
  paint(ctx, '#4b5563', 120, 164, 3);
  ctx.fillStyle = '#ffc21a';
  for (let i = 0; i < 4; i++) ctx.fillRect(92 + i * 9, 120, 5, 5);
  // sandbags
  for (let row = 0; row < 2; row++) {
    for (let x = 14 + row * 8; x < 210 - row * 8; x += 16) {
      if (x > 82 && x < 130) continue;
      ellipse(ctx, x + 8, 184 - row * 10, 9, 6);
      paint(ctx, '#c2b280', 178 - row * 10, 190 - row * 10, 2);
    }
  }
}

const DRAWERS = { 1: era1, 2: era2, 3: era3, 4: era4, 5: era5 };

export function makeCastleTextures(scene) {
  Object.entries(DRAWERS).forEach(([era, draw]) => {
    makeTexture(scene, `castle-${era}`, CASTLE_SIZE, CASTLE_SIZE, draw);
  });
}
