// Every tunable number in one place.
export const BALANCE = {
  startMoney: 30,
  moneyPerClick: 5,
  wavesPerEra: 20,
  speeds: [1, 2, 4],
  counterMultiplier: 3, // trap damage against the enemy type it counters

  // waves: start small, slow, and weak; every wave adds enemies, health, and speed
  firstWaveDelay: 6, // seconds before Wave 1
  waveBreak: 3, // seconds between waves
  waveBaseCount: 3,
  waveCountGrowth: 1.15, // extra enemies per wave number (Wave 20 = 24)
  spawnIntervalStart: 1.8, // seconds between spawns in Wave 1
  spawnIntervalMin: 0.5,
  spawnIntervalStep: 0.06,
  hpGrowth: 0.08, // enemy health +8% per wave number (Wave 20 = x2.5)
  speedGrowth: 0.03, // enemy speed +3% per wave number (Wave 20 = x1.6)
  // kill money is multiplied by the same toughness as health, so harder enemies pay more
  maxEnemiesAlive: 60,
};
