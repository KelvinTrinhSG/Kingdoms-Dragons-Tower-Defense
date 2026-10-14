import * as Phaser from 'phaser';
import { bus } from '../bus.js';
import { buildWorld } from '../world/map.js';
import { LANES, CASTLE_CENTER } from '../world/grid.js';
import { Enemy } from '../world/Enemy.js';
import { createState, snapshot } from '../logic/state.js';
import { clickCastle } from '../logic/economy.js';
import { castleHit } from '../logic/combat.js';
import { buildWave, nextWave } from '../logic/waves.js';
import { BALANCE } from '../data/balance.js';
import { popText, banner } from '../art/fx.js';
import { ART_RES } from '../art/palette.js';

const HP_BAR = { x: CASTLE_CENTER.x, y: 286, w: 120, h: 14 };

// The world: map, castle, enemies, and the wave clock.
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
    this.enemies = [];
    // Wave clock: 'break' counts down to the next wave, 'wave' releases spawns over time.
    this.phase = 'break';
    this.breakLeft = BALANCE.firstWaveDelay;
    this.pending = [];
    this.waveClock = 0;

    this.setupCastle();
    this.hpBar = this.add.graphics().setDepth(5000);
    this.drawHpBar();

    this.listen('ui:menu', () => this.scene.start('Menu'));
    this.listen('ui:restart', () => this.scene.restart());
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

  drawHpBar() {
    const { x, y, w, h } = HP_BAR;
    const ratio = this.state.castleHp / this.state.castleMaxHp;
    const g = this.hpBar;
    g.clear();
    g.fillStyle(0x2b1d12, 1);
    g.fillRoundedRect(x - w / 2 - 3, y - h / 2 - 3, w + 6, h + 6, 9);
    g.fillStyle(0x5a2a1a, 1);
    g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 6);
    if (ratio > 0) {
      g.fillStyle(ratio > 0.5 ? 0x35ec00 : ratio > 0.25 ? 0xffc21a : 0xc7141f, 1);
      g.fillRoundedRect(x - w / 2, y - h / 2, Math.max(12, w * ratio), h, 6);
      g.fillStyle(0xffffff, 0.35);
      g.fillRoundedRect(x - w / 2 + 3, y - h / 2 + 2, Math.max(6, w * ratio - 6), 3, 2);
    }
  }

  // ---- Waves ----

  startWave() {
    const w = buildWave(this.state.era, this.state.wave);
    this.pending = w.spawns;
    this.hpMul = w.hpMul;
    this.waveClock = 0;
    this.phase = 'wave';
    banner(this, this.state.waveRepeating ? `WAVE ${this.state.wave} AGAIN!` : `WAVE ${this.state.wave}`);
  }

  spawn(s) {
    const lane = LANES.find((l) => l.dir === s.dir && l.lane === s.lane);
    this.enemies.push(new Enemy(this, this.state.era, s.role, lane, this.hpMul));
  }

  finishWave() {
    const next = nextWave(this.state);
    if (next.won) {
      this.endGame(true);
      return;
    }
    this.state.wave = next.wave;
    this.state.waveRepeating = next.repeating;
    this.phase = 'break';
    this.breakLeft = BALANCE.waveBreak;
    this.emitState();
  }

  enemyReachedCastle(enemy) {
    enemy.destroy();
    const ended = castleHit(this.state, enemy.damage);
    this.drawHpBar();
    const c = this.world.castle;
    this.tweens.add({ targets: c, x: { from: CASTLE_CENTER.x - 4, to: CASTLE_CENTER.x }, duration: 160, ease: 'Bounce.easeOut' });
    this.cameras.main.shake(120, 0.004);
    popText(this, CASTLE_CENTER.x, CASTLE_CENTER.y - 40, `-${enemy.damage}`, '#FF5A5A', 20);
    this.emitState();
    if (ended) this.endGame(false);
  }

  endGame(won) {
    this.state.over = true;
    this.state.won = won;
    this.phase = 'over';
    this.emitState();
    bus.emit('game:over', {
      won,
      timeMs: Date.now() - this.state.startedAt,
      kills: this.state.kills,
      money: this.state.money,
    });
  }

  update(_time, delta) {
    if (this.phase === 'over') return;
    const dt = (delta / 1000) * this.state.speed;

    if (this.phase === 'break') {
      this.breakLeft -= dt;
      if (this.breakLeft <= 0) this.startWave();
    } else if (this.phase === 'wave') {
      this.waveClock += dt;
      while (this.pending.length && this.pending[0].delay <= this.waveClock && this.enemies.length < BALANCE.maxEnemiesAlive) {
        this.spawn(this.pending.shift());
      }
    }

    for (const e of this.enemies) {
      if (e.dead) continue;
      if (e.update(dt)) {
        this.enemyReachedCastle(e);
        if (this.phase === 'over') break;
      }
    }
    this.enemies = this.enemies.filter((e) => !e.dead);

    if (this.phase === 'wave' && this.pending.length === 0 && this.enemies.length === 0) this.finishWave();
  }
}
