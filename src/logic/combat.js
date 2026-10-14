import { BALANCE } from '../data/balance.js';
import { trapDef } from '../data/eras.js';

// Rules for damage. No Phaser here, so they can be unit-tested.

// Base damage, multiplied against the enemy role this trap counters.
export function trapDamage(def, role) {
  return def.damage * (def.counters === role ? BALANCE.counterMultiplier : 1);
}

// An enemy stepped on a trap: the trap loses 1 use and is removed at 0.
export function hitTrap(state, trap, role) {
  const def = trapDef(trap.trapId);
  const damage = trapDamage(def, role);
  trap.usesLeft -= 1;
  const usedUp = trap.usesLeft <= 0;
  if (usedUp) state.traps = state.traps.filter((t) => t !== trap);
  return { damage, usedUp, countered: def.counters === role };
}

// An enemy reached the castle. Returns true if this ends the game.
export function castleHit(state, damage) {
  if (state.over) return false;
  state.castleHp = Math.max(0, state.castleHp - damage);
  if (state.castleHp === 0) {
    state.over = true;
    state.won = false;
    return true;
  }
  return false;
}
