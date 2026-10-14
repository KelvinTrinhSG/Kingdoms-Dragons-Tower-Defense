// The 5 eras. Names follow prd.md > Era Roster.
// Enemy speed is in pixels per second; damage is what it does to the castle on arrival;
// money + drop is what a kill gives (money grows with the wave's toughness). Each trap counters one enemy role (cheap->fast, mid->standard, expensive->heavy).
export const TIERS = ['cheap', 'mid', 'expensive'];

export const ERAS = [
  {
    id: 1,
    name: 'Prehistoric Cave',
    castleHp: 100,
    enemies: {
      fast: { name: 'Cave runner', hp: 10, speed: 46, damage: 4, money: 2, drop: { stone: 1, wood: 2, gold: 0 } },
      standard: { name: 'Club brute', hp: 26, speed: 32, damage: 8, money: 4, drop: { stone: 2, wood: 2, gold: 1 } },
      heavy: { name: 'Mammoth rider', hp: 80, speed: 22, damage: 20, money: 10, drop: { stone: 5, wood: 4, gold: 3 } },
    },
    traps: {
      cheap: { name: 'Sharpened stakes', price: 10, uses: 1, damage: 14, counters: 'fast' },
      mid: { name: 'Rolling boulder', price: 30, uses: 3, damage: 20, counters: 'standard' },
      expensive: { name: 'Fire pit', price: 70, uses: 5, damage: 30, counters: 'heavy' },
    },
  },
  { id: 2, name: 'Wooden Fort', castleHp: 160 },
  { id: 3, name: 'Stone Castle', castleHp: 240 },
  { id: 4, name: 'Pre-modern Barracks', castleHp: 340 },
  { id: 5, name: 'Modern Barracks', castleHp: 460 },
];

export const LAST_ERA = ERAS.length;

export function eraData(era) {
  return ERAS[era - 1];
}

export function trapId(era, tier) {
  return `t${era}-${tier}`;
}

// 't1-cheap' -> { id, era, tier, name, price, uses, damage, counters }
export function trapDef(id) {
  const [, era, tier] = /^t(\d)-(\w+)$/.exec(id) ?? [];
  const def = eraData(Number(era))?.traps?.[tier];
  return def ? { id, era: Number(era), tier, ...def } : null;
}

export function eraTrapIds(era) {
  return TIERS.map((tier) => trapId(era, tier));
}
