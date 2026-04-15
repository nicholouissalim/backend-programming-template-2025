const { Gacha } = require('../../../models');

async function recordGacha(data) {
  return Gacha.create(data);
}

async function countGachaToday(userId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return Gacha.countDocuments({
    userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
}

async function countPrizeWinners(prizeId) {
  return Gacha.countDocuments({ prizeId });
}

async function getUserHistory(userId) {
  return Gacha.find({ userId }).sort({ createdAt: -1 });
}

async function getAllWinners() {
  return Gacha.find({ prizeId: { $ne: null } }).sort({ prizeId: 1 });
}

module.exports = {
  recordGacha,
  countGachaToday,
  countPrizeWinners,
  getUserHistory,
  getAllWinners,
};
