const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Player = require('../models/Player');
const { generatePlayersForTeam } = require('../utils/playerGenerator');

// 팀 생성
router.post('/create', async (req, res) => {
  try {
    const { name, emblem } = req.body;
    const existingTeam = await Team.findOne({ name });

    if (existingTeam) {
      return res.status(400).json({ message: 'Team name already exists' });
    }

    const team = new Team({
      name,
      emblem,
      players: []
    });

    const savedTeam = await team.save();
    const players = await generatePlayersForTeam(savedTeam._id);
    savedTeam.players = players.map((player) => player._id);
    await savedTeam.save();

    res.json(savedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 팀 이름 가져오기
router.get('/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ name: team.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 팀의 모든 선수 가져오기
router.get('/:teamId/players', async (req, res) => {
  try {
    const { teamId } = req.params;
    const players = await Player.find({ team: teamId });

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
