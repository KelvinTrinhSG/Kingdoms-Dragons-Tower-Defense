import { trapDef, eraData, eraTrapIds, LAST_ERA } from '../data/eras.js';
import { isPathCell } from '../world/grid.js';

// Rules for money and resources. No Phaser here, so they can be unit-tested.

// Each click earns the current era's click money (later castles are worth more per click).
export function clickCastle(state) {
  if (state.over) return 0;
  const amount = eraData(state.era).clickMoney;
  state.money += amount;
  return amount;
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

// What killing an enemy gives: its stone/wood/gold plus money scaled by the wave's toughness.
export function killReward(enemyDef, rewardMul = 1) {
  return { money: Math.round(enemyDef.money * rewardMul), ...enemyDef.drop };
}

// Add a kill's money and stone/wood/gold.
export function addDrop(state, drop) {
  state.money += drop.money ?? 0;
  state.stone += drop.stone;
  state.wood += drop.wood;
  state.gold += drop.gold;
}

// ---- Castle upgrade ----

const RES = ['stone', 'wood', 'gold'];

// Cost to move from the current era to the next one, or null in the last era.
export function upgradeCost(state) {
  return eraData(state.era).upgradeCost ?? null;
}

// What is still missing for the upgrade, e.g. { stone: 0, wood: 12, gold: 3 }.
export function missingForUpgrade(state) {
  const cost = upgradeCost(state);
  if (!cost) return null;
  return Object.fromEntries(RES.map((k) => [k, Math.max(0, cost[k] - state[k])]));
}

export function canUpgrade(state) {
  const missing = missingForUpgrade(state);
  return !state.over && state.era < LAST_ERA && !!missing && RES.every((k) => missing[k] === 0);
}

// Money back for every old-era trap: placed ones by uses left, Inventory ones in full.
export function refundTraps(state) {
  let total = 0;
  for (const t of state.traps) {
    const def = trapDef(t.trapId);
    total += Math.floor((def.price * t.usesLeft) / def.uses);
  }
  for (const [id, count] of Object.entries(state.inventory)) {
    if (count > 0) total += trapDef(id).price * count;
  }
  return total;
}

// Bonus on entering an era: enough to buy 2 of its cheapest trap.
export function eraBonus(era) {
  return 2 * Math.min(...eraTrapIds(era).map((id) => trapDef(id).price));
}

// Spend resources, cash out old traps, add the bonus, refill health, and move to Wave 1 of the next era.
export function applyUpgrade(state) {
  if (!canUpgrade(state)) return null;
  const cost = upgradeCost(state);
  RES.forEach((k) => (state[k] -= cost[k]));
  const refund = refundTraps(state);
  const removedTraps = state.traps.map((t) => t.id);
  const era = state.era + 1;
  const bonus = eraBonus(era);
  const hp = eraData(era).castleHp;
  Object.assign(state, {
    era,
    wave: 1,
    waveRepeating: false,
    money: state.money + refund + bonus,
    castleHp: hp,
    castleMaxHp: hp,
    inventory: Object.fromEntries(eraTrapIds(era).map((id) => [id, 0])),
    traps: [],
  });
  return { era, refund, bonus, removedTraps };
}
