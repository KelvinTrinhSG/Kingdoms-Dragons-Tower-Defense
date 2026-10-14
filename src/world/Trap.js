import { artImage, ART_RES } from '../art/palette.js';
import { FONT } from '../art/fx.js';
import { cellCenter } from './grid.js';

// A trap sprite on a path cell, with a small badge showing uses left.
export class Trap {
  constructor(scene, trap) {
    const { x, y } = cellCenter(trap.col, trap.row);
    const era = trap.trapId.match(/^t(\d)/)[1];
    const tier = trap.trapId.split('-')[1];
    this.scene = scene;
    this.model = trap;
    this.cy = y;
    this.sprite = artImage(scene, x, y, `trap-${era}-${tier}`).setDepth(y - 30);
    this.badge = scene.add.circle(x + 14, y + 12, 8, 0x141f3d).setStrokeStyle(2, 0xffffff).setDepth(y - 29);
    this.label = scene.add
      .text(x + 14, y + 12, '', { fontFamily: FONT, fontSize: '12px', fontStyle: '700', color: '#ffffff' })
      .setOrigin(0.5)
      .setDepth(y - 28);
    this.refresh();
    // drop-in when placed
    this.sprite.setAlpha(0);
    scene.tweens.add({ targets: this.sprite, alpha: 1, y: { from: y - 14, to: y }, duration: 220, ease: 'Bounce.easeOut' });
  }

  refresh() {
    this.label.setText(String(this.model.usesLeft));
  }

  // Short squash when an enemy triggers it.
  trigger() {
    this.refresh();
    const s = 1 / ART_RES;
    this.scene.tweens.killTweensOf(this.sprite);
    this.sprite.setScale(s).setAlpha(1).setY(this.cy);
    this.scene.tweens.add({ targets: this.sprite, scaleX: s * 1.25, scaleY: s * 0.8, duration: 80, yoyo: true });
  }

  destroy(animated = true) {
    const parts = [this.sprite, this.badge, this.label];
    if (!animated) {
      parts.forEach((p) => p.destroy());
      return;
    }
    this.scene.tweens.add({
      targets: parts,
      alpha: 0,
      duration: 250,
      delay: 120,
      onComplete: () => parts.forEach((p) => p.destroy()),
    });
  }
}
