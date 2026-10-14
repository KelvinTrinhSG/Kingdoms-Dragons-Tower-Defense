import * as Phaser from 'phaser';
import '@fontsource/fredoka/400.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import './ui/styles.css';
import { bus } from './bus.js';
import { WIDTH, HEIGHT } from './world/grid.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { initLayout } from './ui/layout.js';
import { initMenu } from './ui/menu.js';
import { initHud } from './ui/hud.js';
import { initStats } from './ui/stats.js';
import { initShop } from './ui/shop.js';
import { initPicker } from './ui/picker.js';

async function start() {
  // Phaser text needs the font ready before it draws.
  await Promise.all([document.fonts.load('700 20px Fredoka'), document.fonts.load('400 20px Fredoka')]).catch(() => {});

  const root = document.getElementById('ui');
  initMenu(root);
  initHud(root);
  initShop(root);
  initPicker(root);
  initStats(root);

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#0d1a33',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [BootScene, MenuScene, GameScene],
  });

  game.events.once('ready', () => initLayout(game, root));

  if (import.meta.env.DEV) window.__td = { game, bus };
}

start();
