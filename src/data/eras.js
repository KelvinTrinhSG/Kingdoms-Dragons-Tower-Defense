// The 5 eras. Names follow prd.md > Era Roster.
// Enemy speed is in pixels per second; damage is what it does to the castle on arrival.
export const ERAS = [
  {
    id: 1,
    name: 'Prehistoric Cave',
    castleHp: 100,
    enemies: {
      fast: { name: 'Cave runner', hp: 14, speed: 62, damage: 4 },
      standard: { name: 'Club brute', hp: 34, speed: 42, damage: 8 },
      heavy: { name: 'Mammoth rider', hp: 95, speed: 28, damage: 20 },
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
