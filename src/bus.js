import * as Phaser from 'phaser';

// The one messenger shared by the world (Phaser) and the interface (HTML).
// Game -> UI: art:ready, scene:menu, scene:game, state:changed, cell:tapped, cell:info, cell:none,
//             castle:moved, game:paused, game:over
// UI -> Game: ui:play, ui:buyTrap, ui:placeTrap, ui:pickerClosed, ui:upgrade, ui:speed, ui:pause, ui:menu, ui:restart
export const bus = new Phaser.Events.EventEmitter();
