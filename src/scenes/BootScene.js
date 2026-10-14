import * as Phaser from 'phaser';
import { makeCastleTextures } from '../art/castle.js';
import { makeEraTextures, ERAS_WITH_ART } from '../art/scenery.js';

// Draws every texture once with code, then opens the menu. No image files are loaded.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    makeCastleTextures(this);
    ERAS_WITH_ART.forEach((era) => makeEraTextures(this, era));
    this.scene.start('Menu');
  }
}
