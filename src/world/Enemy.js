import * as Phaser from 'phaser';
import { artImage, ART_RES } from '../art/palette.js';
import { ENEMY_SIZES } from '../art/enemy.js';
import { eraData } from '../data/eras.js';
import { cellAt } from './grid.js';

// One walking enemy: a sprite following its lane's waypoints toward the castle.
export class Enemy {
  // mods: the wave's { hpMul, speedMul, rewardMul } — later waves are tougher, faster, and pay more.
  constructor(scene, era, role, lane, mods) {
    const def = eraData(era).enemies[role];
    this.scene = scene;
    this.era = era;
    this.role = role;
    this.maxHp = Math.round(def.hp * mods.hpMul);
    this.hp = this.maxHp;
    this.speed = def.speed * mods.speedMul;
    this.rewardMul = mods.rewardMul;
    this.damage = def.damage;
    this.points = lane.points;
    this.next = 1;
    this.x = lane.points[0].x;
    this.y = lane.points[0].y;
    this.hitCells = new Set();
    this.phase = Math.random() * Math.PI * 2;
    this.dead = false;

    this.sprite = artImage(scene, this.x, this.y, `enemy-${era}-${role}`).setOrigin(0.5, 0.92);
    this.sprite.setFlipX(lane.dir === 'E' || lane.dir === 'S');
    this.baseScale = 1 / ART_RES;

    const h = ENEMY_SIZES[role][1];
    this.barOffset = h * 0.92 + 4;
    this.barW = role === 'heavy' ? 40 : 26;
    this.barBg = scene.add.rectangle(0, 0, this.barW + 4, 7, 0x2b1d12).setVisible(false);
    this.barFill = scene.add.rectangle(0, 0, this.barW, 3, 0x35ec00).setOrigin(0, 0.5).setVisible(false);
    this.place();
  }

  place() {
    const bob = Math.abs(Math.sin(this.phase)) * 2.5;
    this.sprite.setPosition(this.x, this.y - bob);
    this.sprite.setRotation(Math.sin(this.phase) * 0.06);
    this.sprite.setDepth(this.y);
    this.barBg.setPosition(this.x, this.y - this.barOffset).setDepth(this.y + 0.5);
    this.barFill.setPosition(this.x - this.barW / 2, this.y - this.barOffset).setDepth(this.y + 0.6);
  }

  // Move along the lane. Returns true when the enemy reaches the castle.
  update(dt) {
    let step = this.speed * dt;
    this.phase += dt * (this.role === 'heavy' ? 7 : 11);
    while (step > 0 && this.next < this.points.length) {
      const t = this.points[this.next];
      const dx = t.x - this.x;
      const dy = t.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= step) {
        this.x = t.x;
        this.y = t.y;
        step -= dist;
        this.next++;
      } else {
        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
        step = 0;
      }
    }
    this.place();
    return this.next >= this.points.length;
  }

  cell() {
    return cellAt(this.x, this.y);
  }

  // Apply damage. Returns true if this killed the enemy.
  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    this.barBg.setVisible(true);
    this.barFill.setVisible(true);
    const ratio = this.hp / this.maxHp;
    this.barFill.width = this.barW * ratio;
    this.barFill.fillColor = ratio > 0.5 ? 0x35ec00 : ratio > 0.25 ? 0xffc21a : 0xc7141f;
    // Phaser 4: fill tint is setTint + setTintMode(FILL), no more setTintFill.
    this.sprite.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    this.scene.time.delayedCall(70, () => this.sprite.active && this.sprite.clearTint());
    return this.hp === 0;
  }

  destroy() {
    this.dead = true;
    this.sprite.destroy();
    this.barBg.destroy();
    this.barFill.destroy();
  }
}
