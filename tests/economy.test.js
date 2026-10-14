import { describe, it, expect } from 'vitest';
import { createState } from '../src/logic/state.js';
import { clickCastle } from '../src/logic/economy.js';
import { BALANCE } from '../src/data/balance.js';

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
