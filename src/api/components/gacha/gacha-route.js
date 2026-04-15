const express = require('express');
const gachaController = require('./gacha-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/gacha', route);

  route.post('/play', gachaController.playGacha);

  route.get('/history/:userId', gachaController.getUserHistory);

  route.get('/prizes', gachaController.getPrizesStatus);

  route.get('/winners', gachaController.getWinnersList);
};
