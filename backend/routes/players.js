const express = require('express');
const router = express.Router();
const { createPlayer } = require('../utils/playerGenerator');

// 개별 플레이어 생성
router.post('/', async (req, res) => {
  try {
    const { name, position, teamId } = req.body;
    const player = await createPlayer(name, position, teamId);

    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
