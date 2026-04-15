const gachaRepository = require('./gacha-repository');

const PRIZES = [
  { id: 1, name: 'Emas 10 gram', quota: 1, chance: 0.01 }, // 1% kemungkinan
  { id: 2, name: 'Smartphone X', quota: 5, chance: 0.05 },
  { id: 3, name: 'Smartwatch Y', quota: 10, chance: 0.1 },
  { id: 4, name: 'Voucher Rp100.000', quota: 100, chance: 0.2 },
  { id: 5, name: 'Pulsa Rp50.000', quota: 500, chance: 0.3 },
];

async function playGacha(userId, userName) {
  // 1. Validasi limit gacha 5 kali per hari per user
  const playCountToday = await gachaRepository.countGachaToday(userId);
  if (playCountToday >= 5) {
    throw new Error('LIMIT_EXCEEDED');
  }

  let wonPrize = null;
  const randomRoll = Math.random();
  let cumulativeChance = 0;

  for (const prize of PRIZES) {
    cumulativeChance += prize.chance;
    if (randomRoll <= cumulativeChance) {
      // Cek apakah kuota hadiah masih tersedia
      const currentWinnersCount = await gachaRepository.countPrizeWinners(
        prize.id
      );
      if (currentWinnersCount < prize.quota) {
        wonPrize = prize;
      }
      break;
    }
  }

  await gachaRepository.recordGacha({
    userId,
    userName,
    prizeId: wonPrize ? wonPrize.id : null,
    prizeName: wonPrize ? wonPrize.name : null,
  });

  return {
    prize: wonPrize ? wonPrize.name : 'Maaf, Anda belum beruntung. Coba lagi!',
    isWin: !!wonPrize,
  };
}

async function getPrizesStatus() {
  const statusList = [];
  for (const prize of PRIZES) {
    const wonCount = await gachaRepository.countPrizeWinners(prize.id);
    statusList.push({
      id: prize.id,
      hadiah: prize.name,
      kuota_awal: prize.quota,
      kuota_tersisa: prize.quota - wonCount,
    });
  }
  return statusList;
}

function maskName(name) {
  if (!name || name.length <= 2) return name;
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

async function getWinners() {
  const winners = await gachaRepository.getAllWinners();

  const result = {};
  PRIZES.forEach((p) => (result[p.name] = []));

  winners.forEach((w) => {
    if (result[w.prizeName]) {
      result[w.prizeName].push(maskName(w.userName));
    }
  });

  return result;
}

async function getUserHistory(userId) {
  return await gachaRepository.getUserHistory(userId);
}

module.exports = {
  playGacha,
  getPrizesStatus,
  getWinners,
  getUserHistory,
};
