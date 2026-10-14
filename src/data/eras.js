// The 5 eras. Names follow prd.md > Era Roster.
export const ERAS = [
  { id: 1, name: 'Prehistoric Cave', castleHp: 100 },
  { id: 2, name: 'Wooden Fort', castleHp: 160 },
  { id: 3, name: 'Stone Castle', castleHp: 240 },
  { id: 4, name: 'Pre-modern Barracks', castleHp: 340 },
  { id: 5, name: 'Modern Barracks', castleHp: 460 },
];

export const LAST_ERA = ERAS.length;

export function eraData(era) {
  return ERAS[era - 1];
}
