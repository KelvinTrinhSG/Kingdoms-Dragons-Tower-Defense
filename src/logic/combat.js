// Rules for damage. No Phaser here, so they can be unit-tested.

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
