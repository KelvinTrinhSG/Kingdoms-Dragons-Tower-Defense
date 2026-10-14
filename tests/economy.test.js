import { describe, it, expect } from 'vitest';
import { createState } from '../src/logic/state.js';
import { clickCastle, buyTrap, placeTrap, addDrop, trapAt } from '../src/logic/economy.js';
import { BALANCE } from '../src/data/balance.js';
import { trapDef } from '../src/data/eras.js';

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
