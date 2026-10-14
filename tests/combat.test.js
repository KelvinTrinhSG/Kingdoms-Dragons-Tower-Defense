import { describe, it, expect } from 'vitest';
import { createState } from '../src/logic/state.js';
import { castleHit, trapDamage, hitTrap } from '../src/logic/combat.js';
import { trapDef } from '../src/data/eras.js';
import { BALANCE } from '../src/data/balance.js';

describe('castleHit', () => {
  it('lowers castle health', () => {
    const s = createState();
    expect(castleHit(s, 10)).toBe(false);
    expect(s.castleHp).toBe(s.castleMaxHp - 10);
  });

  it('ends the game as a loss at 0 and never goes negative', () => {
    const s = createState();
    expect(castleHit(s, 9999)).toBe(true);
    expect(s.castleHp).toBe(0);
    expect(s.over).toBe(true);
    expect(s.won).toBe(false);
    expect(castleHit(s, 5)).toBe(false);
  });
});

describe('traps', () => {
  it('deal extra damage to the enemy type they counter', () => {
    const stakes = trapDef('t1-cheap');
    expect(trapDamage(stakes, 'fast')).toBe(stakes.damage * BALANCE.counterMultiplier);
    expect(trapDamage(stakes, 'heavy')).toBe(stakes.damage);
  });

  it('lose 1 use per hit and disappear at 0', () => {
    const s = createState();
    s.traps.push({ id: 1, trapId: 't1-mid', col: 15, row: 2, usesLeft: 3 });
    const trap = s.traps[0];
    expect(hitTrap(s, trap, 'standard')).toMatchObject({ usedUp: false, countered: true });
    expect(trap.usesLeft).toBe(2);
    hitTrap(s, trap, 'fast');
    expect(hitTrap(s, trap, 'fast').usedUp).toBe(true);
    expect(s.traps).toHaveLength(0);
  });

  it('a 1-use trap is gone after one enemy', () => {
    const s = createState();
    s.traps.push({ id: 2, trapId: 't1-cheap', col: 15, row: 2, usesLeft: 1 });
    expect(hitTrap(s, s.traps[0], 'fast').usedUp).toBe(true);
    expect(s.traps).toHaveLength(0);
  });
});
