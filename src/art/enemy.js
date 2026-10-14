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

// ---- shared parts for later eras ----

const helmet = (color, brim = false) => (ctx, hx, hy, s) => {
  ctx.beginPath();
  ctx.arc(hx, hy - 1 * s, 8.6 * s, Math.PI, 0);
  ctx.closePath();
  paint(ctx, color, hy - 10 * s, hy, 2.5);
  if (brim) {
    ctx.beginPath();
    ctx.rect(hx - 11 * s, hy - 1.5 * s, 22 * s, 3 * s);
    flat(ctx, shade(color, -0.15), 2);
  }
};

const hood = (color) => (ctx, hx, hy, s) => {
  ctx.beginPath();
  ctx.moveTo(hx - 9 * s, hy + 4 * s);
  ctx.quadraticCurveTo(hx - 10 * s, hy - 12 * s, hx + 2 * s, hy - 11 * s);
  ctx.quadraticCurveTo(hx + 9 * s, hy - 9 * s, hx + 7 * s, hy - 3 * s);
  ctx.lineTo(hx - 3 * s, hy - 4 * s);
  ctx.lineTo(hx - 4 * s, hy + 6 * s);
  ctx.closePath();
  paint(ctx, color, hy - 12 * s, hy + 6 * s, 2.5);
};

const hat = (color, kind) => (ctx, hx, hy, s) => {
  if (kind === 'tricorn') {
    poly(ctx, [[hx - 11 * s, hy - 4 * s], [hx, hy - 13 * s], [hx + 11 * s, hy - 4 * s], [hx, hy - 6 * s]]);
    paint(ctx, color, hy - 13 * s, hy - 4 * s, 2.5);
  } else if (kind === 'shako') {
    ctx.beginPath();
    ctx.rect(hx - 6 * s, hy - 17 * s, 12 * s, 12 * s);
    paint(ctx, color, hy - 17 * s, hy - 5 * s, 2.5);
    ctx.beginPath();
    ctx.rect(hx - 8 * s, hy - 6 * s, 16 * s, 2.5 * s);
    flat(ctx, OUTLINE, 0);
    ellipse(ctx, hx, hy - 18 * s, 2.5 * s, 2.5 * s);
    flat(ctx, '#ffffff', 1.5);
  } else {
    // straw hat
    ellipse(ctx, hx, hy - 6 * s, 12 * s, 3 * s);
    paint(ctx, color, hy - 9 * s, hy - 3 * s, 2);
    ellipse(ctx, hx, hy - 9 * s, 6 * s, 4 * s);
    paint(ctx, color, hy - 13 * s, hy - 5 * s, 2);
  }
};

const stick = (len, color, angle, tip) => (ctx, x, y, s) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  limb(ctx, -len * 0.3 * s, 0, len * 0.7 * s, 0, 2.5 * s, color);
  tip?.(ctx, len * 0.7 * s, 0, s);
  ctx.restore();
};

const spearTip = (ctx, x, y, s) => {
  poly(ctx, [[x, y - 3 * s], [x + 9 * s, y], [x, y + 3 * s]]);
  flat(ctx, '#c9ced6', 2);
};

const forkTip = (ctx, x, y, s) => {
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 2;
  [-3, 0, 3].forEach((dy) => {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * s);
    ctx.lineTo(x + 8 * s, y + dy * s);
    ctx.stroke();
  });
};

const sword = (ctx, x, y, s) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.8);
  poly(ctx, [[-1.5 * s, 0], [1.5 * s, 0], [1.5 * s, -18 * s], [0, -22 * s], [-1.5 * s, -18 * s]]);
  flat(ctx, '#d6dbe2', 2);
  ctx.beginPath();
  ctx.rect(-5 * s, -1 * s, 10 * s, 2.5 * s);
  flat(ctx, '#8b5a2b', 1.5);
  ctx.restore();
};

const gun = (len, stock = '#6b4423') => (ctx, x, y, s) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.15);
  ctx.beginPath();
  ctx.roundRect(-10 * s, -2 * s, 12 * s, 5 * s, 2 * s);
  flat(ctx, stock, 2);
  ctx.beginPath();
  ctx.rect(0, -1.5 * s, len * s, 3 * s);
  flat(ctx, '#2f3338', 2);
  ctx.restore();
};

const shield = (color, kite = false) => (ctx, cx, gy, s) => {
  const x = cx - 6 * s;
  const y = gy - 22 * s;
  if (kite) poly(ctx, [[x - 7 * s, y - 9 * s], [x + 7 * s, y - 9 * s], [x + 6 * s, y + 3 * s], [x, y + 12 * s], [x - 6 * s, y + 3 * s]]);
  else ellipse(ctx, x, y, 8 * s, 9 * s);
  paint(ctx, color, y - 9 * s, y + 12 * s, 2.5);
};

const crossBelts = (ctx, cx, gy, s) => {
  ctx.strokeStyle = '#f3ead2';
  ctx.lineWidth = 2.2 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 7 * s, gy - 30 * s);
  ctx.lineTo(cx + 7 * s, gy - 14 * s);
  ctx.moveTo(cx + 7 * s, gy - 30 * s);
  ctx.lineTo(cx - 7 * s, gy - 14 * s);
  ctx.stroke();
};

const camo = (ctx, cx, gy, s) => {
  ctx.fillStyle = 'rgba(43, 60, 30, 0.55)';
  [[-4, -26, 3], [3, -20, 3.5], [-2, -16, 2.5], [4, -28, 2]].forEach(([dx, dy, r]) => {
    ellipse(ctx, cx + dx * s, gy + dy * s, r * s, r * 0.7 * s);
    ctx.fill();
  });
};

function wheel(ctx, x, y, r, color = '#8b5a2b') {
  ellipse(ctx, x, y, r, r);
  flat(ctx, color, 2.5);
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1.5;
  for (let a = 0; a < Math.PI; a += Math.PI / 4) {
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.lineTo(x - Math.cos(a) * r, y - Math.sin(a) * r);
    ctx.stroke();
  }
  ellipse(ctx, x, y, r * 0.25, r * 0.25);
  flat(ctx, '#3a2614', 1.5);
}

function horse(ctx, gy, coat, cloth) {
  [[30, -0.12], [42, 0], [66, -0.12], [78, 0]].forEach(([x, d]) => {
    limb(ctx, x, gy - 30, x + 2, gy - 3, 6, shade(coat, d));
  });
  ellipse(ctx, 54, gy - 38, 32, 15);
  paint(ctx, coat, gy - 53, gy - 23, 3);
  // neck + head
  poly(ctx, [[76, gy - 46], [90, gy - 70], [102, gy - 64], [88, gy - 38]]);
  paint(ctx, coat, gy - 70, gy - 38, 3);
  ctx.beginPath();
  ctx.roundRect(92, gy - 72, 18, 11, 5);
  paint(ctx, coat, gy - 72, gy - 61, 2.5);
  ellipse(ctx, 98, gy - 68, 1.6, 1.6);
  ctx.fillStyle = OUTLINE;
  ctx.fill();
  // tail
  ctx.beginPath();
  ctx.moveTo(24, gy - 44);
  ctx.quadraticCurveTo(10, gy - 36, 14, gy - 18);
  ctx.lineWidth = 5;
  ctx.strokeStyle = OUTLINE;
  ctx.stroke();
  // caparison
  ctx.beginPath();
  ctx.moveTo(32, gy - 50);
  ctx.lineTo(76, gy - 50);
  ctx.lineTo(80, gy - 26);
  ctx.lineTo(28, gy - 26);
  ctx.closePath();
  paint(ctx, cloth, gy - 50, gy - 26, 2.5);
}

const ERA_ENEMIES_MORE = {
  2: {
    fast: (ctx, w, h) =>
      humanoid(ctx, w / 2 - 2, h - 5, 1, {
        torso: '#9a7b4f',
        legs: '#6b4a2b',
        head: hat('#e3c065'),
        weapon: stick(30, '#8b5a2b', -0.5, forkTip),
      }),
    standard: (ctx, w, h) =>
      humanoid(ctx, w / 2 - 4, h - 5, 1.3, {
        torso: '#3f6fb5',
        legs: '#5a4a3a',
        head: helmet('#9aa1aa', true),
        back: shield('#c7141f'),
        weapon: stick(40, '#8b5a2b', -1.1, spearTip),
      }),
    heavy(ctx, w, h) {
      const gy = h - 5;
      dropShadow(ctx, w / 2, gy, 44, 6);
      horse(ctx, gy, '#e8e2d6', '#1259e0');
      humanoid(ctx, 54, gy - 44, 0.9, {
        shadow: false,
        torso: '#c9ced6',
        legs: '#9aa1aa',
        head: helmet('#c9ced6'),
        weapon: stick(52, '#8b5a2b', -0.25, spearTip),
      });
    },
  },
  3: {
    fast: (ctx, w, h) =>
      humanoid(ctx, w / 2 - 2, h - 5, 1, {
        torso: '#3f7f3a',
        legs: '#5a4a3a',
        head: hood('#2f6b3a'),
        weapon: (c, x, y, s) => {
          c.beginPath();
          c.arc(x + 2 * s, y, 11 * s, -1.2, 1.2);
          c.lineWidth = 3;
          c.strokeStyle = OUTLINE;
          c.stroke();
          c.lineWidth = 1.5;
          c.strokeStyle = '#8b5a2b';
          c.stroke();
        },
      }),
    standard: (ctx, w, h) =>
      humanoid(ctx, w / 2 - 4, h - 5, 1.3, {
        torso: '#a9adb3',
        legs: '#6b6f75',
        torsoDetail: (c, cx, gy, s) => {
          c.beginPath();
          c.rect(cx - 4 * s, gy - 30 * s, 8 * s, 17 * s);
          flat(c, '#c7141f', 1.5);
        },
        head: helmet('#c9ced6', false),
        back: shield('#1259e0', true),
        weapon: sword,
      }),
    heavy(ctx, w, h) {
      const gy = h - 5;
      dropShadow(ctx, w / 2, gy, 46, 6);
      // roofed ram on wheels
      ctx.beginPath();
      ctx.rect(14, gy - 44, 76, 26);
      paint(ctx, '#8b5a2b', gy - 44, gy - 18, 3);
      ctx.strokeStyle = 'rgba(43,29,18,0.4)';
      ctx.lineWidth = 1.5;
      for (let x = 24; x < 90; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, gy - 43);
        ctx.lineTo(x, gy - 19);
        ctx.stroke();
      }
      poly(ctx, [[8, gy - 42], [52, gy - 74], [96, gy - 42]]);
      paint(ctx, '#a8743e', gy - 74, gy - 42, 3);
      // ram log with iron head
      ctx.beginPath();
      ctx.roundRect(30, gy - 36, 66, 11, 5);
      paint(ctx, '#7a4a22', gy - 36, gy - 25, 2.5);
      ctx.beginPath();
      ctx.roundRect(92, gy - 39, 14, 17, 5);
      paint(ctx, '#4b5563', gy - 39, gy - 22, 2.5);
      wheel(ctx, 28, gy - 12, 11);
      wheel(ctx, 76, gy - 12, 11);
    },
  },
  4: {
    fast: (ctx, w, h) =>
      humanoid(ctx, w / 2 - 2, h - 5, 1, {
        torso: '#3f6b4a',
        legs: '#e8e2d6',
        head: hat('#2f3338', 'tricorn'),
        weapon: gun(10),
      }),
    standard: (ctx, w, h) =>
      humanoid(ctx, w / 2 - 4, h - 5, 1.3, {
        torso: '#c7141f',
        legs: '#f3ead2',
        torsoDetail: crossBelts,
        head: hat('#1f2937', 'shako'),
        weapon: gun(26),
      }),
    heavy(ctx, w, h) {
      const gy = h - 5;
      dropShadow(ctx, w / 2, gy, 46, 6);
      // carriage
      poly(ctx, [[16, gy - 22], [70, gy - 36], [78, gy - 26], [24, gy - 12]]);
      paint(ctx, '#8b5a2b', gy - 36, gy - 12, 3);
      // barrel
      ctx.save();
      ctx.translate(46, gy - 42);
      ctx.rotate(-0.12);
      ctx.beginPath();
      ctx.roundRect(-10, -9, 62, 18, 8);
      paint(ctx, '#2f3338', -9, 9, 3);
      ctx.beginPath();
      ctx.rect(46, -11, 8, 22);
      flat(ctx, '#2f3338', 2.5);
      ctx.restore();
      wheel(ctx, 46, gy - 18, 16, '#a8743e');
      // gunner pushing from behind
      humanoid(ctx, 12, gy, 0.85, { shadow: false, torso: '#1259e0', legs: '#f3ead2', head: hat('#2f3338', 'tricorn') });
    },
  },
  5: {
    fast(ctx, w, h) {
      const gy = h - 5;
      dropShadow(ctx, w / 2, gy, 20, 4);
      // motorbike
      wheel(ctx, 10, gy - 8, 7, '#2f3338');
      wheel(ctx, 38, gy - 8, 7, '#2f3338');
      poly(ctx, [[10, gy - 10], [22, gy - 22], [36, gy - 22], [40, gy - 10], [26, gy - 12]]);
      paint(ctx, '#c7141f', gy - 22, gy - 10, 2.5);
      limb(ctx, 36, gy - 22, 40, gy - 32, 2.5, '#4b5563');
      humanoid(ctx, 24, gy - 14, 0.7, {
        shadow: false,
        torso: '#1f2937',
        legs: '#374151',
        head: helmet('#111827'),
      });
    },
    standard: (ctx, w, h) =>
      humanoid(ctx, w / 2 - 4, h - 5, 1.3, {
        torso: '#5d7d44',
        legs: '#4a6236',
        torsoDetail: camo,
        head: helmet('#4a6236', true),
        weapon: gun(24, '#2f3338'),
      }),
    heavy(ctx, w, h) {
      const gy = h - 5;
      dropShadow(ctx, w / 2, gy, 48, 6);
      // treads
      ctx.beginPath();
      ctx.roundRect(8, gy - 24, 92, 22, 11);
      paint(ctx, '#2f3338', gy - 24, gy - 2, 3);
      [20, 36, 52, 68, 84].forEach((x) => {
        ellipse(ctx, x, gy - 13, 6, 6);
        flat(ctx, '#6b7280', 2);
      });
      // hull
      poly(ctx, [[6, gy - 26], [16, gy - 42], [92, gy - 42], [104, gy - 26]]);
      paint(ctx, '#5d7d44', gy - 42, gy - 26, 3);
      // turret + barrel
      ctx.beginPath();
      ctx.rect(56, gy - 54, 52, 7);
      paint(ctx, '#4a6236', gy - 54, gy - 47, 2.5);
      ctx.beginPath();
      ctx.roundRect(30, gy - 62, 40, 22, [10, 10, 2, 2]);
      paint(ctx, '#6b8f4e', gy - 62, gy - 40, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(40, gy - 54, 8, 3);
    },
  },
};

Object.assign(ERA_ENEMIES, ERA_ENEMIES_MORE);

export function makeEnemyTextures(scene) {
  Object.entries(ERA_ENEMIES).forEach(([era, roles]) => {
    ROLES.forEach((role) => {
      const [w, h] = ENEMY_SIZES[role];
      makeTexture(scene, `enemy-${era}-${role}`, w, h, roles[role]);
    });
  });
}
