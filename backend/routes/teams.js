// backend/routes/teams.js
const express = require('express');
const Team = require('../models/Team');
const router = express.Router();

router.post('/create', async (req, res) => {
    const { name, emblem } = req.body;

    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
        return res.status(400).json({ message: 'Team name already exists' });
    }

    const team = new Team({ name, emblem });
    await team.save();
    res.json(team);
});

router.get('/kbo-emblems', async (req, res) => {
    const kboEmblems = ['KIA', 'LG', 'NC', 'SSG', 'Doosan', 'Samsung', 'Hanwha', 'Lotte', 'KT', 'Kiwoom'];
    res.json(kboEmblems);
});

module.exports = router;
