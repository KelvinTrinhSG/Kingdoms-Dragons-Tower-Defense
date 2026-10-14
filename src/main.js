import * as Phaser from 'phaser';
import '@fontsource/fredoka/400.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import './ui/styles.css';
import { bus } from './bus.js';
import { WIDTH, HEIGHT } from './world/grid.js';
import { LAST_ERA } from './data/eras.js';
import { BALANCE } from './data/balance.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { initLayout } from './ui/layout.js';
import { initMenu } from './ui/menu.js';
import { initHud } from './ui/hud.js';
import { initStats } from './ui/stats.js';
import { initShop } from './ui/shop.js';
import { initPicker } from './ui/picker.js';
import { initUpgrade } from './ui/upgrade.js';

// Testing aid: ?era=3&wave=18&money=5000&res=999 starts a run at that point. Ignored when absent.
function readDevShortcuts() {
  const q = new URLSearchParams(location.search);
  const num = (k, min, max) => {
    if (!q.has(k)) return undefined;
    const n = Math.floor(Number(q.get(k)));
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : undefined;
  };
  const opts = {
    era: num('era', 1, LAST_ERA),
    wave: num('wave', 1, BALANCE.wavesPerEra),
    money: num('money', 0, 1e7),
    res: num('res', 0, 1e7),
  };
  return Object.fromEntries(Object.entries(opts).filter(([, v]) => v !== undefined));
}

async function start() {
  // Phaser text needs the font ready before it draws.
  await Promise.all([document.fonts.load('700 20px Fredoka'), document.fonts.load('400 20px Fredoka')]).catch(() => {});

  const root = document.getElementById('ui');
  initMenu(root);
  initHud(root);
  initShop(root);
  initUpgrade(root);
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
  game.registry.set('devOpts', readDevShortcuts());

  game.events.once('ready', () => initLayout(game, root));

  if (import.meta.env.DEV) window.__td = { game, bus };
}

start();
