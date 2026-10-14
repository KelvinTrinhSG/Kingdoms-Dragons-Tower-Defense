import { describe, it, expect } from 'vitest';
import { createState } from '../src/logic/state.js';
import { castleHit } from '../src/logic/combat.js';

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
