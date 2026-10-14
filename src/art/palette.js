// Shared colors and small Canvas 2D helpers for the Kingdom Rush-like look:
// chunky shapes, thick dark outlines, soft top-left light, drop shadows.

export const OUTLINE = '#2b1d12';

// Textures are drawn at 2x and shown at 0.5 scale so they stay crisp when the canvas is scaled up.
export const ART_RES = 2;

export const ERA_PALETTES = {
  1: { ground: '#9bb35a', path: '#b98b55', accent: '#8a7f73', leaf: '#5f8f3a', wood: '#8b5a2b' },
  2: { ground: '#7fae4a', path: '#c9a66b', accent: '#8b5a2b', leaf: '#3f7f34', wood: '#8b5a2b' },
  3: { ground: '#6f9e45', path: '#b9ad97', accent: '#8a8f96', leaf: '#2f6b3a', wood: '#6b4423' },
  4: { ground: '#8a9a52', path: '#a89a7a', accent: '#9c4a33', leaf: '#56743a', wood: '#6b4a2b' },
  5: { ground: '#5d7d44', path: '#5f6166', accent: '#4b5563', leaf: '#3d5e33', wood: '#55483a' },
};

// Lighten (amt > 0) or darken (amt < 0) a hex color.
export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// Small seeded random generator so scenery is the same every run.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fill the current path with a top-light gradient and stroke the dark outline.
export function paint(ctx, base, y0, y1, width = 3) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, shade(base, 0.28));
  g.addColorStop(0.55, base);
  g.addColorStop(1, shade(base, -0.22));
  ctx.fillStyle = g;
  ctx.fill();
  if (width > 0) {
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = OUTLINE;
    ctx.stroke();
  }
}

export function flat(ctx, color, width = 3) {
  ctx.fillStyle = color;
  ctx.fill();
  if (width > 0) {
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = OUTLINE;
    ctx.stroke();
  }
}

export function dropShadow(ctx, cx, cy, rx, ry, alpha = 0.3) {
  ctx.save();
  ctx.fillStyle = `rgba(20, 12, 4, ${alpha})`;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function ellipse(ctx, cx, cy, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
}

export function poly(ctx, pts) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// A soft white shine stroke along the top-left of a shape.
export function shine(ctx, x0, y0, x1, y1, width = 3, alpha = 0.45) {
  ctx.save();
  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.restore();
}

// Draw into a new canvas texture at ART_RES. `draw(ctx, w, h)` works in logical pixels.
export function makeTexture(scene, key, w, h, draw) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.createCanvas(key, w * ART_RES, h * ART_RES);
  const ctx = tex.getContext();
  ctx.save();
  ctx.scale(ART_RES, ART_RES);
  draw(ctx, w, h);
  ctx.restore();
  tex.refresh();
}

// Place a code-drawn texture at logical size.
export function artImage(scene, x, y, key) {
  return scene.add.image(x, y, key).setScale(1 / ART_RES);
}
