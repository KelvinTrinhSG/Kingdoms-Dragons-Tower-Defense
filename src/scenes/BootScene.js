import * as Phaser from 'phaser';
import { makeCastleTextures } from '../art/castle.js';
import { makeEraTextures, ERAS_WITH_ART } from '../art/scenery.js';
import { makeEnemyTextures } from '../art/enemy.js';

// Draws every texture once with code, then opens the menu. No image files are loaded.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    makeCastleTextures(this);
    makeEnemyTextures(this);
    ERAS_WITH_ART.forEach((era) => makeEraTextures(this, era));
    this.scene.start('Menu');
  }
}
