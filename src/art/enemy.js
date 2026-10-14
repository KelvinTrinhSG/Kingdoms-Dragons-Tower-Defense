import { makeTexture, paint, flat, poly, ellipse, dropShadow, shade, OUTLINE } from './palette.js';

// Every enemy is drawn side-on, facing right, standing on the bottom of its texture.
// Fast = small, standard = medium, heavy = large with a mount or vehicle.
export const ENEMY_SIZES = { fast: [48, 56], standard: [64, 72], heavy: [110, 96] };
export const ROLES = ['fast', 'standard', 'heavy'];

function limb(ctx, x0, y0, x1, y1, w, color) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = w + 3;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.stroke();
}

// The shared humanoid template. Hooks draw the era-specific head gear, weapon, and torso detail.
export function humanoid(ctx, cx, gy, s, o) {
  const skin = o.skin ?? '#e0a872';
  if (o.shadow !== false) dropShadow(ctx, cx, gy, 13 * s, 3.5 * s);
  // legs
  limb(ctx, cx - 3 * s, gy - 14 * s, cx - 6 * s, gy - 2 * s, 4.5 * s, shade(o.legs ?? skin, -0.15));
  limb(ctx, cx + 3 * s, gy - 14 * s, cx + 6 * s, gy - 2 * s, 4.5 * s, o.legs ?? skin);
  // back arm
  limb(ctx, cx - 2 * s, gy - 26 * s, cx - 8 * s, gy - 17 * s, 4 * s, shade(skin, -0.15));
  o.back?.(ctx, cx, gy, s);
  // torso
  ctx.beginPath();
  ctx.roundRect(cx - 8 * s, gy - 31 * s, 16 * s, 19 * s, 5 * s);
  paint(ctx, o.torso, gy - 31 * s, gy - 12 * s, 2.5);
  o.torsoDetail?.(ctx, cx, gy, s);
  // head
  ellipse(ctx, cx + 1 * s, gy - 38 * s, 8 * s, 8 * s);
  paint(ctx, skin, gy - 46 * s, gy - 30 * s, 2.5);
  ellipse(ctx, cx + 5 * s, gy - 39 * s, 1.4 * s, 1.6 * s);
  ctx.fillStyle = OUTLINE;
  ctx.fill();
  o.head?.(ctx, cx + 1 * s, gy - 38 * s, s);
  // weapon, then front arm over it
  const hand = { x: cx + 11 * s, y: gy - 20 * s };
  o.weapon?.(ctx, hand.x, hand.y, s);
  limb(ctx, cx + 2 * s, gy - 27 * s, hand.x, hand.y, 4 * s, skin);
}

// ---- Era 1: Prehistoric ----

const cavemanHair = (ctx, hx, hy, s) => {
  poly(ctx, [
    [hx - 9 * s, hy + 1 * s], [hx - 10 * s, hy - 6 * s], [hx - 6 * s, hy - 10 * s], [hx, hy - 11 * s],
    [hx + 6 * s, hy - 9 * s], [hx + 9 * s, hy - 4 * s], [hx + 4 * s, hy - 5 * s], [hx - 3 * s, hy - 3 * s], [hx - 5 * s, hy + 3 * s],
  ]);
  flat(ctx, '#5a3418', 2);
};

const leopardSpots = (ctx, cx, gy, s) => {
  ctx.fillStyle = 'rgba(90, 52, 24, 0.75)';
  [[-4, -26], [3, -22], [-2, -17], [5, -28]].forEach(([dx, dy]) => {
    ellipse(ctx, cx + dx * s, gy + dy * s, 1.8 * s, 1.4 * s);
    ctx.fill();
  });
};

const ERA_ENEMIES = {
  1: {
    fast(ctx, w, h) {
      humanoid(ctx, w / 2 - 2, h - 5, 1, {
        torso: '#e8b04a',
        torsoDetail: leopardSpots,
        head: cavemanHair,
        weapon: (c, x, y, s) => {
          poly(c, [[x - 2 * s, y + 2 * s], [x + 2 * s, y - 2 * s], [x + 10 * s, y - 10 * s], [x + 5 * s, y + 1 * s]]);
          flat(c, '#9a8f82', 2);
        },
      });
    },
    standard(ctx, w, h) {
      humanoid(ctx, w / 2 - 6, h - 5, 1.3, {
        torso: '#8b5a2b',
        head: cavemanHair,
        weapon: (c, x, y, s) => {
          // big club raised over the shoulder
          c.save();
          c.translate(x, y);
          c.rotate(-0.9);
          c.beginPath();
          c.moveTo(-2 * s, 2 * s);
          c.lineTo(2 * s, 2 * s);
          c.quadraticCurveTo(7 * s, -16 * s, 4 * s, -24 * s);
          c.quadraticCurveTo(-3 * s, -27 * s, -6 * s, -20 * s);
          c.closePath();
          paint(c, '#a86a32', -27 * s, 2 * s, 2.5);
          c.restore();
        },
      });
    },
    heavy(ctx, w, h) {
      const gy = h - 5;
      dropShadow(ctx, w / 2, gy, 44, 6);
      const fur = '#7a4a2a';
      // legs
      [[26, -0.12], [40, 0], [64, -0.12], [78, 0]].forEach(([x, d]) => {
        ctx.beginPath();
        ctx.roundRect(x - 6, gy - 26, 12, 24, 4);
        paint(ctx, shade(fur, d), gy - 26, gy, 2.5);
      });
      // body
      ellipse(ctx, 52, gy - 36, 40, 25);
      paint(ctx, fur, gy - 61, gy - 11, 3);
      // shaggy fringe
      ctx.strokeStyle = shade(fur, -0.3);
      ctx.lineWidth = 2;
      for (let x = 20; x < 86; x += 7) {
        ctx.beginPath();
        ctx.moveTo(x, gy - 18);
        ctx.lineTo(x + 2, gy - 12);
        ctx.stroke();
      }
      // head + trunk
      ellipse(ctx, 88, gy - 46, 16, 15);
      paint(ctx, shade(fur, 0.05), gy - 61, gy - 31, 3);
      ctx.beginPath();
      ctx.moveTo(98, gy - 44);
      ctx.quadraticCurveTo(108, gy - 26, 100, gy - 10);
      ctx.lineTo(94, gy - 12);
      ctx.quadraticCurveTo(98, gy - 26, 90, gy - 36);
      ctx.closePath();
      paint(ctx, shade(fur, 0.05), gy - 44, gy - 10, 2.5);
      // tusk
      ctx.beginPath();
      ctx.moveTo(92, gy - 34);
      ctx.quadraticCurveTo(110, gy - 30, 108, gy - 46);
      ctx.quadraticCurveTo(104, gy - 34, 90, gy - 38);
      ctx.closePath();
      paint(ctx, '#f3ead2', gy - 46, gy - 30, 2.5);
      // ear and eye
      ellipse(ctx, 80, gy - 46, 7, 10);
      paint(ctx, shade(fur, -0.15), gy - 56, gy - 36, 2.5);
      ellipse(ctx, 93, gy - 50, 2, 2.2);
      ctx.fillStyle = OUTLINE;
      ctx.fill();
      // rider
      humanoid(ctx, 48, gy - 54, 0.8, {
        shadow: false,
        torso: '#e8b04a',
        torsoDetail: leopardSpots,
        head: cavemanHair,
        weapon: (c, x, y, s) => {
          limb(c, x - 6 * s, y + 10 * s, x + 14 * s, y - 14 * s, 2.5 * s, '#8b5a2b');
          poly(c, [[x + 12 * s, y - 12 * s], [x + 20 * s, y - 22 * s], [x + 16 * s, y - 10 * s]]);
          flat(c, '#9a8f82', 2);
        },
      });
    },
  },
};

export function makeEnemyTextures(scene) {
  Object.entries(ERA_ENEMIES).forEach(([era, roles]) => {
    ROLES.forEach((role) => {
      const [w, h] = ENEMY_SIZES[role];
      makeTexture(scene, `enemy-${era}-${role}`, w, h, roles[role]);
    });
  });
}
