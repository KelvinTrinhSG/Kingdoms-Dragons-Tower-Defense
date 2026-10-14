import { BALANCE } from '../data/balance.js';
import { eraData, eraTrapIds } from '../data/eras.js';

// A fresh run. `opts` carries dev shortcuts (era, wave, money, res) when present.
export function createState(opts = {}, now = Date.now()) {
  const era = opts.era ?? 1;
  const res = opts.res ?? 0;
  const hp = eraData(era).castleHp;
  return {
    era,
    wave: opts.wave ?? 1,
    waveRepeating: false,
    money: opts.money ?? BALANCE.startMoney,
    stone: res,
    wood: res,
    gold: res,
    castleHp: hp,
    castleMaxHp: hp,
    inventory: Object.fromEntries(eraTrapIds(era).map((id) => [id, 0])),
    traps: [],
    kills: 0,
    startedAt: now,
    speed: 1,
    over: false,
    won: false,
  };
}

// A copy the interface can read without touching the live state.
export function snapshot(state) {
  return { ...state, inventory: { ...state.inventory }, traps: state.traps.map((t) => ({ ...t })) };
}
