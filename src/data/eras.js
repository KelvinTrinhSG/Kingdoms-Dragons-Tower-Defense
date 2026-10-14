// The 5 eras. Names follow prd.md > Era Roster.
// Enemy speed is in pixels per second; damage is what it does to the castle on arrival;
// money + drop is what a kill gives (money grows with the wave's toughness).
// Each trap counters one enemy role (cheap->fast, mid->standard, expensive->heavy).
// upgradeCost is what it takes to move on to the NEXT era (none for the last era).
export const TIERS = ['cheap', 'mid', 'expensive'];

const drop = (stone, wood, gold) => ({ stone, wood, gold });

export const ERAS = [
  {
    id: 1,
    name: 'Prehistoric Cave',
    castleHp: 100,
    upgradeCost: drop(50, 70, 12),
    enemies: {
      fast: { name: 'Cave runner', hp: 10, speed: 46, damage: 4, money: 2, drop: drop(1, 2, 0) },
      standard: { name: 'Club brute', hp: 26, speed: 32, damage: 8, money: 4, drop: drop(2, 2, 1) },
      heavy: { name: 'Mammoth rider', hp: 80, speed: 22, damage: 20, money: 10, drop: drop(5, 4, 3) },
    },
    traps: {
      cheap: { name: 'Sharpened stakes', price: 10, uses: 1, damage: 14, counters: 'fast' },
      mid: { name: 'Rolling boulder', price: 30, uses: 3, damage: 20, counters: 'standard' },
      expensive: { name: 'Fire pit', price: 70, uses: 5, damage: 30, counters: 'heavy' },
    },
  },
  {
    id: 2,
    name: 'Wooden Fort',
    castleHp: 160,
    upgradeCost: drop(110, 140, 30),
    enemies: {
      fast: { name: 'Peasant raider', hp: 18, speed: 50, damage: 6, money: 3, drop: drop(2, 3, 0) },
      standard: { name: 'Spearman', hp: 45, speed: 36, damage: 12, money: 6, drop: drop(3, 3, 1) },
      heavy: { name: 'Mounted knight', hp: 140, speed: 30, damage: 28, money: 15, drop: drop(6, 5, 4) },
    },
    traps: {
      cheap: { name: 'Caltrops', price: 15, uses: 1, damage: 24, counters: 'fast' },
      mid: { name: 'Bear trap', price: 45, uses: 3, damage: 34, counters: 'standard' },
      expensive: { name: 'Burning oil', price: 105, uses: 5, damage: 50, counters: 'heavy' },
    },
  },
  {
    id: 3,
    name: 'Stone Castle',
    castleHp: 240,
    upgradeCost: drop(200, 220, 55),
    enemies: {
      fast: { name: 'Scout', hp: 30, speed: 54, damage: 8, money: 4, drop: drop(3, 3, 1) },
      standard: { name: 'Swordsman', hp: 75, speed: 38, damage: 16, money: 9, drop: drop(4, 4, 2) },
      heavy: { name: 'Battering ram', hp: 240, speed: 24, damage: 40, money: 22, drop: drop(8, 7, 5) },
    },
    traps: {
      cheap: { name: 'Iron spikes', price: 22, uses: 1, damage: 40, counters: 'fast' },
      mid: { name: 'Pendulum blade', price: 65, uses: 3, damage: 56, counters: 'standard' },
      expensive: { name: 'Boulder drop', price: 150, uses: 5, damage: 85, counters: 'heavy' },
    },
  },
  {
    id: 4,
    name: 'Pre-modern Barracks',
    castleHp: 340,
    upgradeCost: drop(320, 340, 90),
    enemies: {
      fast: { name: 'Skirmisher', hp: 50, speed: 58, damage: 10, money: 6, drop: drop(4, 4, 1) },
      standard: { name: 'Musketeer', hp: 125, speed: 40, damage: 22, money: 13, drop: drop(5, 5, 3) },
      heavy: { name: 'Cannon cart', hp: 400, speed: 26, damage: 55, money: 32, drop: drop(10, 9, 7) },
    },
    traps: {
      cheap: { name: 'Tripwire', price: 32, uses: 1, damage: 66, counters: 'fast' },
      mid: { name: 'Powder keg', price: 95, uses: 3, damage: 95, counters: 'standard' },
      expensive: { name: 'Buried cannon charge', price: 220, uses: 5, damage: 140, counters: 'heavy' },
    },
  },
  {
    id: 5,
    name: 'Modern Barracks',
    castleHp: 460,
    upgradeCost: null,
    enemies: {
      fast: { name: 'Motorbike raider', hp: 80, speed: 66, damage: 14, money: 8, drop: drop(5, 5, 2) },
      standard: { name: 'Rifleman', hp: 200, speed: 42, damage: 30, money: 18, drop: drop(6, 6, 3) },
      heavy: { name: 'Tank', hp: 650, speed: 26, damage: 75, money: 45, drop: drop(12, 11, 9) },
    },
    traps: {
      cheap: { name: 'Barbed wire', price: 45, uses: 1, damage: 110, counters: 'fast' },
      mid: { name: 'Landmine', price: 135, uses: 3, damage: 155, counters: 'standard' },
      expensive: { name: 'Anti-tank mine', price: 310, uses: 5, damage: 230, counters: 'heavy' },
    },
  },
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
