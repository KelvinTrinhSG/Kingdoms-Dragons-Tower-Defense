import { BALANCE } from '../data/balance.js';

// Rules for money and resources. No Phaser here, so they can be unit-tested.

export function clickCastle(state) {
  if (state.over) return 0;
  state.money += BALANCE.moneyPerClick;
  return BALANCE.moneyPerClick;
}
