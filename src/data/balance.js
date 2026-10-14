// Every tunable number in one place.
export const BALANCE = {
  startMoney: 30,
  moneyPerClick: 5,
  wavesPerEra: 20,
  speeds: [1, 2, 4],

  // waves
  firstWaveDelay: 6, // seconds before Wave 1
  waveBreak: 3, // seconds between waves
  waveBaseCount: 5,
  waveCountGrowth: 1.1, // extra enemies per wave number
  spawnIntervalStart: 1.5, // seconds between spawns in Wave 1
  spawnIntervalMin: 0.5,
  spawnIntervalStep: 0.045,
  hpGrowth: 0.05, // enemy health +5% per wave number
  maxEnemiesAlive: 60,
};
