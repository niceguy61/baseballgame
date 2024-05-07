const express = require('express');
const router = express.Router();
const Stats = require('../models/Stats');

// 모든 통계 가져오기
router.get('/', async (req, res) => {
  try {
    const stats = await Stats.find({});
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 특정 팀의 통계 가져오기
router.get('/team/:team', async (req, res) => {
  try {
    const team = req.params.team;
    const stats = await Stats.find({ team });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 특정 선수의 통계 가져오기
router.get('/player/:player', async (req, res) => {
  try {
    const player = req.params.player;
    const stats = await Stats.find({ player });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
