const express = require('express');
const {
  createGachaSet,
  drawGacha,
  getGachaLogs,
  getRareItemLogs
} = require('../controllers/gachaController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/set', authenticateToken, createGachaSet);
router.post('/draw', authenticateToken, drawGacha);
router.get('/logs', authenticateToken, getGachaLogs);
router.get('/rare-logs', authenticateToken, getRareItemLogs);

module.exports = router;
