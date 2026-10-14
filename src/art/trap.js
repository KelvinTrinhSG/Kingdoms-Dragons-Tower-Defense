import { makeTexture, paint, flat, poly, ellipse, shade, shine, OUTLINE } from './palette.js';
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
