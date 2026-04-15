const gachaService = require('./gacha-service');

async function playGacha(req, res, next) {
  try {
    // Asumsi user mengirim userId dan userName di body request
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ error: 'userId dan userName harus diisi' });
    }

    const result = await gachaService.playGacha(userId, userName);
    return res
      .status(200)
      .json({ success: true, message: 'Gacha berhasil!', data: result });
  } catch (error) {
    if (error.message === 'LIMIT_EXCEEDED') {
      return res.status(403).json({
        success: false,
        error: 'Kuota gacha harian Anda habis. Maksimal 5x per hari.',
      });
    }
    next(error);
  }
}

async function getPrizesStatus(req, res, next) {
  try {
    const status = await gachaService.getPrizesStatus();
    return res.status(200).json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
}

async function getWinnersList(req, res, next) {
  try {
    const winners = await gachaService.getWinners();
    return res.status(200).json({ success: true, data: winners });
  } catch (error) {
    next(error);
  }
}

async function getUserHistory(req, res, next) {
  try {
    const { userId } = req.params;
    const history = await gachaService.getUserHistory(userId);
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  playGacha,
  getPrizesStatus,
  getWinnersList,
  getUserHistory,
};
