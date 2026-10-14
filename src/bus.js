import * as Phaser from 'phaser';

// The one messenger shared by the world (Phaser) and the interface (HTML).
// Game -> UI: scene:menu, scene:game, state:changed, cell:tapped, cell:info, castle:moved, game:over
// UI -> Game: ui:play, ui:buyTrap, ui:placeTrap, ui:upgrade, ui:speed, ui:menu, ui:restart
export const bus = new Phaser.Events.EventEmitter();
