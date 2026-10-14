import * as Phaser from 'phaser';
import { bus } from '../bus.js';
import { buildWorld } from '../world/map.js';
import { createState, snapshot } from '../logic/state.js';
import { clickCastle } from '../logic/economy.js';
import { popText } from '../art/fx.js';
import { ART_RES } from '../art/palette.js';

// The world: map, castle, and (in later slices) traps, enemies, and waves.
export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.devOpts = data?.devOpts ?? this.registry.get('devOpts') ?? {};
  }

  create() {
    this.state = createState(this.devOpts);
    this.world = buildWorld(this, this.state.era);
    this.setupCastle();

    this.listen('ui:menu', () => this.scene.start('Menu'));
    bus.emit('scene:game');
    this.emitState();
  }

  // Subscribe to a bus event for the lifetime of this scene.
  listen(event, fn) {
    bus.on(event, fn);
    this.events.once('shutdown', () => bus.off(event, fn));
  }

  emitState() {
    bus.emit('state:changed', snapshot(this.state));
  }

  setupCastle() {
    const castle = this.world.castle;
    // Round hit area over the castle footprint, in texture pixels.
    const hit = new Phaser.Geom.Circle(castle.width / 2, castle.height * 0.6, 88 * ART_RES);
    castle.setInteractive({ hitArea: hit, hitAreaCallback: Phaser.Geom.Circle.Contains, useHandCursor: true });
    const base = 1 / ART_RES;
    castle.on('pointerdown', (pointer) => {
      const gained = clickCastle(this.state);
      if (!gained) return;
      popText(this, pointer.worldX, pointer.worldY - 10, `+${gained}`);
      this.tweens.killTweensOf(castle);
      castle.setScale(base * 1.06, base * 0.94);
      this.tweens.add({ targets: castle, scaleX: base, scaleY: base, duration: 180, ease: 'Back.easeOut' });
      this.emitState();
    });
  }
}
