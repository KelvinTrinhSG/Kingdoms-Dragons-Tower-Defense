import * as Phaser from 'phaser';
import { bus } from '../bus.js';
import { buildWorld } from '../world/map.js';
import { WIDTH, HEIGHT } from '../world/grid.js';

// The Era 1 map as a live background behind the Main Menu.
export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    buildWorld(this, 1);
    const cam = this.cameras.main;
    cam.centerOn(WIDTH / 2, HEIGHT / 2);
    this.tweens.add({ targets: cam, zoom: { from: 1.08, to: 1.18 }, duration: 9000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const onPlay = () => this.scene.start('Game');
    bus.on('ui:play', onPlay);
    this.events.once('shutdown', () => bus.off('ui:play', onPlay));
    bus.emit('scene:menu');
  }
}
