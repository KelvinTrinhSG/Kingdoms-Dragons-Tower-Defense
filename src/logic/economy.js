import { BALANCE } from '../data/balance.js';
import { trapDef } from '../data/eras.js';
import { isPathCell } from '../world/grid.js';

// Rules for money and resources. No Phaser here, so they can be unit-tested.

export function clickCastle(state) {
  if (state.over) return 0;
  state.money += BALANCE.moneyPerClick;
  return BALANCE.moneyPerClick;
}

export function canAfford(state, price) {
  return state.money >= price;
}

// Buy one trap of the current era into the Inventory. Returns true on success.
export function buyTrap(state, id) {
  const def = trapDef(id);
  if (state.over || !def || def.era !== state.era || !canAfford(state, def.price)) return false;
  state.money -= def.price;
  state.inventory[id] = (state.inventory[id] ?? 0) + 1;
  return true;
}

export function trapAt(state, col, row) {
  return state.traps.find((t) => t.col === col && t.row === row) ?? null;
}

let nextTrapId = 1;

// Move one trap from the Inventory onto an empty path cell. Returns the placed trap or null.
export function placeTrap(state, id, col, row) {
  const def = trapDef(id);
  if (state.over || !def || !(state.inventory[id] > 0)) return null;
  if (!isPathCell(col, row) || trapAt(state, col, row)) return null;
  state.inventory[id] -= 1;
  const trap = { id: nextTrapId++, trapId: id, col, row, usesLeft: def.uses };
  state.traps.push(trap);
  return trap;
}

// A killed enemy's stone/wood/gold.
export function addDrop(state, drop) {
  state.stone += drop.stone;
  state.wood += drop.wood;
  state.gold += drop.gold;
}
