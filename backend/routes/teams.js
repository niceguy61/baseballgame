const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// 모든 팀 목록 가져오기
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find({});
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 새로운 팀 생성
router.post('/create', async (req, res) => {
  const { name, emblem, players } = req.body;
  try {
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team name already exists' });
    }

    const team = new Team({ name, emblem, players });
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 특정 팀의 정보 가져오기
router.get('/:name', async (req, res) => {
  try {
    const team = await Team.findOne({ name: req.params.name });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/kbo-emblems', async (req, res) => {
    const kboEmblems = ['KIA', 'LG', 'NC', 'SSG', 'Doosan', 'Samsung', 'Hanwha', 'Lotte', 'KT', 'Kiwoom'];
    res.json(kboEmblems);
});

module.exports = router;
