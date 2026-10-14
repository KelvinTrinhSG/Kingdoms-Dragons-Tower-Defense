import { makeTexture, paint, flat, poly, ellipse, shade, shine, OUTLINE } from './palette.js';

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
import { TIERS } from '../data/eras.js';

// Every trap = a shared base plate + an era-specific top. Textures are 48x48 centered on the cell.
export const TRAP_SIZE = 48;

function basePlate(ctx, color = '#6b4a2b') {
  ellipse(ctx, 24, 30, 19, 12);
  ctx.fillStyle = 'rgba(20,12,4,0.3)';
  ctx.fill();
  ellipse(ctx, 24, 28, 18, 11);
  paint(ctx, color, 17, 39, 2.5);
  ellipse(ctx, 24, 27, 12, 6.5);
  ctx.fillStyle = shade(color, -0.25);
  ctx.fill();
}

function flame(ctx, x, y, h) {
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.quadraticCurveTo(x + h * 0.55, y - h * 0.35, x + h * 0.32, y);
  ctx.lineTo(x - h * 0.32, y);
  ctx.quadraticCurveTo(x - h * 0.55, y - h * 0.35, x, y - h);
  const g = ctx.createLinearGradient(0, y - h, 0, y);
  g.addColorStop(0, '#fff04d');
  g.addColorStop(0.5, '#ff9e16');
  g.addColorStop(1, '#ff6b0a');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = OUTLINE;
  ctx.stroke();
}

const ERA_TRAPS = {
  1: {
    cheap(ctx) {
      basePlate(ctx, '#7a5530');
      [[14, 30, -0.35], [22, 26, -0.1], [29, 31, 0.15], [35, 26, 0.35]].forEach(([x, y, a]) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a);
        poly(ctx, [[-3, 4], [-3, -10], [0, -17], [3, -10], [3, 4]]);
        paint(ctx, '#c08a4a', -17, 4, 2);
        ctx.restore();
      });
    },
    mid(ctx) {
      basePlate(ctx, '#7a5530');
      ctx.beginPath();
      ctx.rect(8, 30, 32, 5);
      flat(ctx, '#8b5a2b', 2);
      ellipse(ctx, 24, 21, 13, 12.5);
      paint(ctx, '#9a8f82', 8, 34, 2.5);
      ctx.strokeStyle = shade('#9a8f82', -0.35);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(20, 13);
      ctx.lineTo(24, 20);
      ctx.lineTo(21, 27);
      ctx.moveTo(24, 20);
      ctx.lineTo(31, 22);
      ctx.stroke();
      shine(ctx, 15, 16, 19, 12, 2.5);
    },
    expensive(ctx) {
      // stone ring with burning logs
      ellipse(ctx, 24, 30, 20, 12);
      ctx.fillStyle = 'rgba(20,12,4,0.3)';
      ctx.fill();
      ellipse(ctx, 24, 28, 15, 8);
      flat(ctx, '#3a2614', 2.5);
      const stones = 9;
      for (let i = 0; i < stones; i++) {
        const a = (i / stones) * Math.PI * 2;
        ellipse(ctx, 24 + Math.cos(a) * 17, 28 + Math.sin(a) * 10, 5, 4);
        paint(ctx, '#9a8f82', 24 - 4, 24 + 4, 2);
      }
      ctx.save();
      ctx.translate(24, 28);
      [-0.5, 0.5].forEach((a) => {
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.roundRect(-11, -2.5, 22, 5, 2);
        flat(ctx, '#8b5a2b', 2);
        ctx.restore();
      });
      ctx.restore();
      flame(ctx, 24, 28, 22);
      flame(ctx, 17, 29, 12);
      flame(ctx, 31, 29, 13);
    },
  },
};

function spike(ctx, x, y, h, color) {
  poly(ctx, [[x - 3.5, y], [x, y - h], [x + 3.5, y]]);
  paint(ctx, color, y - h, y, 2);
}

function barrel(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h, w, h, 5);
  paint(ctx, '#9a6332', y - h, y, 2.5);
  ctx.strokeStyle = '#3a3f45';
  ctx.lineWidth = 2.5;
  [y - h + 4, y - 4].forEach((by) => {
    ctx.beginPath();
    ctx.moveTo(x - w / 2 + 1, by);
    ctx.lineTo(x + w / 2 - 1, by);
    ctx.stroke();
  });
}

function spark(ctx, x, y) {
  ctx.fillStyle = '#fff04d';
  poly(ctx, [[x, y - 6], [x + 2, y - 2], [x + 6, y], [x + 2, y + 2], [x, y + 6], [x - 2, y + 2], [x - 6, y], [x - 2, y - 2]]);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#ff6b0a';
  ctx.stroke();
}

function mine(ctx, r, body, ring) {
  ellipse(ctx, 24, 31, r + 2, (r + 2) * 0.55);
  ctx.fillStyle = 'rgba(20,12,4,0.3)';
  ctx.fill();
  ellipse(ctx, 24, 30, r, r * 0.55);
  paint(ctx, shade(body, -0.25), 30 - r * 0.55, 30 + r * 0.55, 2.5);
  ellipse(ctx, 24, 26, r, r * 0.55);
  paint(ctx, shade(body, 0.15), 26 - r * 0.55, 26 + r * 0.55, 2.5);
  ellipse(ctx, 24, 25, r * 0.4, r * 0.25);
  flat(ctx, ring, 2);
}

Object.assign(ERA_TRAPS, {
  2: {
    cheap(ctx) {
      basePlate(ctx, '#7a5530');
      [[14, 28], [24, 22], [33, 30], [22, 33], [31, 22]].forEach(([x, y]) => {
        spike(ctx, x, y + 3, 9, '#8a9099');
        spike(ctx, x + 4, y + 4, 6, '#6b7280');
      });
    },
    mid(ctx) {
      basePlate(ctx, '#7a5530');
      ellipse(ctx, 24, 28, 14, 7);
      flat(ctx, '#4b5563', 3);
      for (let i = 0; i < 10; i++) {
        const a = Math.PI + (i / 9) * Math.PI;
        const x = 24 + Math.cos(a) * 13;
        const y = 28 + Math.sin(a) * 6.5;
        spike(ctx, x, y + 1, 7, '#c9ced6');
      }
      ellipse(ctx, 24, 28, 5, 2.5);
      flat(ctx, '#9aa1aa', 2);
    },
    expensive(ctx) {
      ellipse(ctx, 24, 32, 20, 10);
      ctx.fillStyle = 'rgba(20,12,4,0.3)';
      ctx.fill();
      ellipse(ctx, 24, 30, 18, 9);
      flat(ctx, '#1f1a14', 2.5);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ellipse(ctx, 18, 28, 6, 2);
      ctx.fill();
      flame(ctx, 18, 31, 16);
      flame(ctx, 29, 31, 20);
      // tipped pot
      ctx.save();
      ctx.translate(38, 18);
      ctx.rotate(0.9);
      ctx.beginPath();
      ctx.roundRect(-7, -9, 14, 18, 6);
      paint(ctx, '#7a4a22', -9, 9, 2.5);
      ctx.restore();
    },
  },
  3: {
    cheap(ctx) {
      basePlate(ctx, '#6b6f75');
      [10, 17, 24, 31, 38].forEach((x, i) => spike(ctx, x, 32 - (i % 2) * 4, 16, '#c9ced6'));
    },
    mid(ctx) {
      basePlate(ctx, '#7a5530');
      // frame
      ctx.beginPath();
      ctx.rect(10, 4, 4, 28);
      flat(ctx, '#8b5a2b', 2);
      ctx.beginPath();
      ctx.rect(34, 4, 4, 28);
      flat(ctx, '#8b5a2b', 2);
      ctx.beginPath();
      ctx.rect(8, 3, 32, 4);
      flat(ctx, '#8b5a2b', 2);
      limb(ctx, 24, 6, 20, 20, 1.5, '#4b5563');
      ctx.beginPath();
      ctx.moveTo(10, 20);
      ctx.quadraticCurveTo(20, 34, 32, 22);
      ctx.lineTo(28, 18);
      ctx.quadraticCurveTo(20, 26, 13, 17);
      ctx.closePath();
      paint(ctx, '#d6dbe2', 17, 34, 2);
    },
    expensive(ctx) {
      basePlate(ctx, '#6b6f75');
      // tripod
      limb(ctx, 8, 34, 24, 4, 2.5, '#8b5a2b');
      limb(ctx, 40, 34, 24, 4, 2.5, '#8b5a2b');
      limb(ctx, 24, 6, 24, 12, 1.5, '#3a3f45');
      ellipse(ctx, 24, 20, 11, 10);
      paint(ctx, '#9a8f82', 10, 30, 2.5);
      shine(ctx, 17, 15, 21, 12, 2);
    },
  },
  4: {
    cheap(ctx) {
      basePlate(ctx, '#7a6a4a');
      ctx.beginPath();
      ctx.rect(8, 16, 4, 18);
      flat(ctx, '#8b5a2b', 2);
      ctx.beginPath();
      ctx.rect(36, 16, 4, 18);
      flat(ctx, '#8b5a2b', 2);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(12, 24);
      ctx.lineTo(36, 24);
      ctx.stroke();
      ellipse(ctx, 24, 30, 6, 6);
      flat(ctx, '#2f3338', 2);
      spark(ctx, 28, 24);
    },
    mid(ctx) {
      basePlate(ctx, '#7a6a4a');
      barrel(ctx, 24, 36, 22, 26);
      ctx.fillStyle = OUTLINE;
      ctx.font = '700 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('XXX', 24, 27);
      limb(ctx, 30, 10, 36, 4, 1.5, '#3a3f45');
      spark(ctx, 37, 4);
    },
    expensive(ctx) {
      // earth mound with a cannon muzzle and lit fuse
      ellipse(ctx, 24, 32, 21, 10);
      ctx.fillStyle = 'rgba(20,12,4,0.3)';
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(4, 32);
      ctx.quadraticCurveTo(24, 6, 44, 32);
      ctx.closePath();
      paint(ctx, '#8a7a55', 12, 32, 2.5);
      ellipse(ctx, 24, 22, 8, 8);
      flat(ctx, '#2f3338', 2.5);
      ellipse(ctx, 24, 22, 4, 4);
      flat(ctx, '#111111', 1.5);
      limb(ctx, 34, 20, 40, 10, 1.5, '#3a3f45');
      spark(ctx, 41, 9);
    },
  },
  5: {
    cheap(ctx) {
      basePlate(ctx, '#55483a');
      ctx.beginPath();
      ctx.rect(6, 14, 3, 20);
      flat(ctx, '#4b5563', 1.5);
      ctx.beginPath();
      ctx.rect(39, 14, 3, 20);
      flat(ctx, '#4b5563', 1.5);
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        ellipse(ctx, 12 + i * 6, 24, 5, 8);
        ctx.stroke();
      }
      ctx.strokeStyle = '#c9ced6';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        ellipse(ctx, 12 + i * 6, 24, 5, 8);
        ctx.stroke();
      }
    },
    mid: (ctx) => mine(ctx, 12, '#6b7280', '#c7141f'),
    expensive(ctx) {
      mine(ctx, 17, '#5d7d44', '#3a3f45');
      ctx.fillStyle = '#ffd23a';
      [[-12, 0], [8, 0]].forEach(([dx]) => {
        ctx.fillRect(24 + dx, 27, 4, 4);
      });
    },
  },
});

export function makeTrapTextures(scene) {
  Object.entries(ERA_TRAPS).forEach(([era, tiers]) => {
    TIERS.forEach((tier) => makeTexture(scene, `trap-${era}-${tier}`, TRAP_SIZE, TRAP_SIZE, tiers[tier]));
  });
}

// Data URLs of each trap texture for the HTML interface (Shop, Inventory, picker).
export function trapIconUrls(scene) {
  const urls = {};
  Object.keys(ERA_TRAPS).forEach((era) => {
    TIERS.forEach((tier) => {
      const tex = scene.textures.get(`trap-${era}-${tier}`);
      urls[`t${era}-${tier}`] = tex.getSourceImage().toDataURL();
    });
  });
  return urls;
}
