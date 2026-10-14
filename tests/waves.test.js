import { describe, it, expect } from 'vitest';
import { buildWave, waveMix, nextWave } from '../src/logic/waves.js';
import { rng } from '../src/art/palette.js';
import { BALANCE } from '../src/data/balance.js';

describe('buildWave', () => {
  it('grows with the wave number', () => {
    for (let w = 1; w < 20; w++) {
      expect(buildWave(1, w + 1, rng(w)).spawns.length).toBeGreaterThanOrEqual(buildWave(1, w, rng(w)).spawns.length);
    }
    expect(buildWave(1, 20, rng(1)).hpMul).toBeGreaterThan(buildWave(1, 1, rng(1)).hpMul);
  });

  it('attacks from all 4 directions', () => {
    for (let w = 1; w <= 20; w++) {
      const { spawns } = buildWave(1, w, rng(w * 7));
      const dirs = new Set(spawns.map((s) => s.dir));
      // small early waves: every enemy from a different side; 4+ enemies: all sides
      expect(dirs.size).toBe(Math.min(4, spawns.length));
    }
  });

  it('brings more heavies later', () => {
    expect(waveMix(1).heavy).toBe(0);
    expect(waveMix(20).heavy).toBeGreaterThan(waveMix(6).heavy);
  });

  it('spawns in order with non-negative delays', () => {
    const { spawns } = buildWave(1, 10, rng(3));
    spawns.forEach((s, i) => {
      expect(s.delay).toBeGreaterThanOrEqual(0);
      if (i) expect(s.delay).toBeGreaterThanOrEqual(spawns[i - 1].delay);
      expect([0, 1]).toContain(s.lane);
    });
  });
});

describe('nextWave', () => {
  const last = BALANCE.wavesPerEra;
  it('advances within an era', () => {
    expect(nextWave({ era: 1, wave: 3 })).toEqual({ wave: 4, repeating: false, won: false });
  });
  it('repeats Wave 20 when the player has not upgraded', () => {
    expect(nextWave({ era: 2, wave: last })).toEqual({ wave: last, repeating: true, won: false });
  });
  it('wins after Wave 20 of Era 5', () => {
    expect(nextWave({ era: 5, wave: last }).won).toBe(true);
  });
});

describe('difficulty ramp', () => {
  it('starts with few, slow, weak enemies and gets more, faster, tankier', () => {
    const w1 = buildWave(1, 1, rng(1));
    const w20 = buildWave(1, 20, rng(1));
    expect(w1.spawns.length).toBeLessThanOrEqual(3);
    expect(w20.spawns.length).toBeGreaterThan(w1.spawns.length * 5);
    expect(w1.hpMul).toBe(1);
    expect(w1.speedMul).toBe(1);
    expect(w20.hpMul).toBeGreaterThan(2);
    expect(w20.speedMul).toBeGreaterThan(1.4);
    expect(w20.rewardMul).toBeGreaterThan(w1.rewardMul);
  });
});
