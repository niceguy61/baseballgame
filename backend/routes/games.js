// backend/routes/games.js
const express = require('express');
const Game = require('../models/Game');
const router = express.Router();

module.exports = (io) => {
    router.get('/current', async (req, res) => {
        const game = await Game.findOne({}).sort({ date: -1 });
        res.json(game);
    });

    router.post('/play', async (req, res) => {
        const { action, team } = req.body;
        let game = await Game.findOne({}).sort({ date: -1 });

        if (!game) {
            game = new Game({ homeTeam: 'Team A', awayTeam: 'Team B' });
        }

        game.logs.push(`${team} ${action}`);
        game.save();

        io.emit('gameUpdate', game);

        res.json(game);
    });

    return router;
};
