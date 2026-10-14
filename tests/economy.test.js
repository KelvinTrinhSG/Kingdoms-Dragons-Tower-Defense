import { describe, it, expect } from 'vitest';
import { createState } from '../src/logic/state.js';
import { clickCastle, buyTrap, placeTrap, addDrop, trapAt, killReward, canUpgrade, missingForUpgrade, applyUpgrade, refundTraps, eraBonus, upgradeCost } from '../src/logic/economy.js';
import { BALANCE } from '../src/data/balance.js';
import { trapDef, ERAS } from '../src/data/eras.js';

describe('createState', () => {
  it('starts in Era 1, Wave 1 with starting money and full castle health', () => {
    const s = createState();
    expect(s.era).toBe(1);
    expect(s.wave).toBe(1);
    expect(s.money).toBe(BALANCE.startMoney);
    expect(s.castleHp).toBe(s.castleMaxHp);
    expect(s.castleHp).toBeGreaterThan(0);
  });

  it('applies dev shortcuts', () => {
    const s = createState({ era: 3, wave: 18, money: 5000, res: 999 });
    expect([s.era, s.wave, s.money, s.stone, s.wood, s.gold]).toEqual([3, 18, 5000, 999, 999, 999]);
  });
});

describe('clickCastle', () => {
  it('adds money per click', () => {
    const s = createState();
    const gained = clickCastle(s);
    expect(gained).toBe(BALANCE.moneyPerClick);
    expect(s.money).toBe(BALANCE.startMoney + BALANCE.moneyPerClick);
  });

  it('does nothing after the game is over', () => {
    const s = createState();
    s.over = true;
    expect(clickCastle(s)).toBe(0);
    expect(s.money).toBe(BALANCE.startMoney);
  });
});

describe('buyTrap', () => {
  it('lowers money by the price and adds 1 to the Inventory', () => {
    const s = createState({ money: 100 });
    expect(buyTrap(s, 't1-cheap')).toBe(true);
    expect(s.money).toBe(100 - trapDef('t1-cheap').price);
    expect(s.inventory['t1-cheap']).toBe(1);
  });

  it('refuses a trap the player cannot afford', () => {
    const s = createState({ money: 5 });
    expect(buyTrap(s, 't1-expensive')).toBe(false);
    expect(s.money).toBe(5);
    expect(s.inventory['t1-expensive']).toBe(0);
  });

  it('only sells traps of the current era', () => {
    const s = createState({ era: 2, money: 9999 });
    expect(buyTrap(s, 't1-cheap')).toBe(false);
  });

  it('prices rise with uses, and the cheapest has 1 use', () => {
    const [a, b, c] = ['t1-cheap', 't1-mid', 't1-expensive'].map(trapDef);
    expect(a.uses).toBe(1);
    expect(a.price < b.price && b.price < c.price).toBe(true);
    expect(a.uses < b.uses && b.uses < c.uses).toBe(true);
  });
});

describe('placeTrap', () => {
  it('moves a trap from the Inventory onto an empty path cell', () => {
    const s = createState({ money: 100 });
    buyTrap(s, 't1-cheap');
    const t = placeTrap(s, 't1-cheap', 15, 3);
    expect(t).toMatchObject({ trapId: 't1-cheap', col: 15, row: 3, usesLeft: 1 });
    expect(s.inventory['t1-cheap']).toBe(0);
    expect(trapAt(s, 15, 3)).toBe(t);
  });

  it('rejects grass cells, occupied cells, and an empty Inventory', () => {
    const s = createState({ money: 100 });
    buyTrap(s, 't1-cheap');
    buyTrap(s, 't1-cheap');
    expect(placeTrap(s, 't1-cheap', 2, 2)).toBeNull(); // grass
    expect(placeTrap(s, 't1-cheap', 15, 3)).not.toBeNull();
    expect(placeTrap(s, 't1-cheap', 15, 3)).toBeNull(); // occupied
    expect(placeTrap(s, 't1-mid', 16, 3)).toBeNull(); // none owned
  });
});

describe('addDrop', () => {
  it('adds stone, wood, and gold', () => {
    const s = createState();
    addDrop(s, { stone: 2, wood: 3, gold: 1 });
    expect([s.stone, s.wood, s.gold]).toEqual([2, 3, 1]);
  });
});

describe('killReward', () => {
  const enemies = ERAS[0].enemies;
  it('gives money plus stone/wood/gold, and adds them all', () => {
    const s = createState();
    const r = killReward(enemies.fast, 1);
    expect(r.money).toBe(enemies.fast.money);
    addDrop(s, r);
    expect(s.money).toBe(BALANCE.startMoney + r.money);
    expect(s.wood).toBe(enemies.fast.drop.wood);
  });

  it('pays more for tougher enemies and later waves', () => {
    expect(killReward(enemies.heavy, 1).money).toBeGreaterThan(killReward(enemies.standard, 1).money);
    expect(killReward(enemies.standard, 1).money).toBeGreaterThan(killReward(enemies.fast, 1).money);
    expect(killReward(enemies.fast, 2.5).money).toBeGreaterThan(killReward(enemies.fast, 1).money);
  });
});

describe('castle upgrade', () => {
  it('is blocked without enough resources and lists what is missing', () => {
    const s = createState();
    s.stone = 10;
    expect(canUpgrade(s)).toBe(false);
    const cost = ERAS[0].upgradeCost;
    expect(missingForUpgrade(s)).toEqual({ stone: cost.stone - 10, wood: cost.wood, gold: cost.gold });
    expect(applyUpgrade(s)).toBeNull();
    expect(s.era).toBe(1);
  });

  it('moves to Wave 1 of the next era, refills health, and spends resources', () => {
    const s = createState({ res: 999, wave: 14 });
    s.castleHp = 3;
    applyUpgrade(s);
    const cost = ERAS[0].upgradeCost;
    expect(s.era).toBe(2);
    expect(s.wave).toBe(1);
    expect(s.castleHp).toBe(ERAS[1].castleHp);
    expect(s.castleMaxHp).toBe(ERAS[1].castleHp);
    expect([s.stone, s.wood, s.gold]).toEqual([999 - cost.stone, 999 - cost.wood, 999 - cost.gold]);
  });

  it('cashes out every old trap (map and Inventory) plus the era bonus', () => {
    const s = createState({ res: 999, money: 1000 });
    buyTrap(s, 't1-mid');
    buyTrap(s, 't1-mid');
    buyTrap(s, 't1-expensive');
    const placed = placeTrap(s, 't1-mid', 15, 2);
    placed.usesLeft = 1; // 1 of 3 uses left
    const moneyBefore = s.money;
    const mid = trapDef('t1-mid');
    const exp = trapDef('t1-expensive');
    const expectedRefund = Math.floor(mid.price / 3) + mid.price + exp.price;
    expect(refundTraps(s)).toBe(expectedRefund);
    const r = applyUpgrade(s);
    expect(r.refund).toBe(expectedRefund);
    expect(s.money).toBe(moneyBefore + expectedRefund + eraBonus(2));
    expect(s.traps).toHaveLength(0);
    expect(Object.keys(s.inventory)).toEqual(['t2-cheap', 't2-mid', 't2-expensive']);
    expect(Object.values(s.inventory).every((n) => n === 0)).toBe(true);
  });

  it('refunds are never negative', () => {
    const s = createState({ money: 100 });
    buyTrap(s, 't1-cheap');
    const t = placeTrap(s, 't1-cheap', 15, 2);
    t.usesLeft = 0;
    expect(refundTraps(s)).toBeGreaterThanOrEqual(0);
  });

  it('the era bonus buys exactly 2 of the new era cheapest trap', () => {
    for (let era = 2; era <= 5; era++) {
      const cheapest = Math.min(...['cheap', 'mid', 'expensive'].map((t) => trapDef(`t${era}-${t}`).price));
      expect(eraBonus(era)).toBe(cheapest * 2);
      const s = createState({ era, money: eraBonus(era) });
      expect(buyTrap(s, `t${era}-cheap`)).toBe(true);
      expect(buyTrap(s, `t${era}-cheap`)).toBe(true);
      expect(s.money).toBe(0);
    }
  });

  it('has no upgrade beyond Era 5', () => {
    const s = createState({ era: 5, res: 99999 });
    expect(upgradeCost(s)).toBeNull();
    expect(canUpgrade(s)).toBe(false);
    expect(applyUpgrade(s)).toBeNull();
  });

  it('every era has 3 enemies and 3 priced traps with uses 1/3/5', () => {
    ERAS.forEach((era) => {
      expect(Object.keys(era.enemies)).toEqual(['fast', 'standard', 'heavy']);
      const traps = ['cheap', 'mid', 'expensive'].map((t) => era.traps[t]);
      expect(traps.map((t) => t.uses)).toEqual([1, 3, 5]);
      expect(traps[0].price < traps[1].price && traps[1].price < traps[2].price).toBe(true);
    });
  });
});
