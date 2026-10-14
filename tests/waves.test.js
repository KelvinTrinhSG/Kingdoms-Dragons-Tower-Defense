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
      const dirs = new Set(buildWave(1, w, rng(w * 7)).spawns.map((s) => s.dir));
      expect([...dirs].sort()).toEqual(['E', 'N', 'S', 'W']);
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
