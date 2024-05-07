const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Event = require('../models/Event');

module.exports = (io) => {
  router.get('/current', async (req, res) => {
    try {
      let ongoingGame = await Game.findOne({ status: 'ongoing' }).populate('lineup.home').populate('lineup.away');
      if (!ongoingGame) {
        ongoingGame = await createNewGame();
        if (!ongoingGame) {
          return res.status(500).json({ message: 'Failed to create a new game' });
        }
        ongoingGame = await ongoingGame.populate('lineup.home').populate('lineup.away').execPopulate();
      }

      const homePitcher = ongoingGame.lineup.home.find(player => player.position === 'Pitcher');
      const awayPitcher = ongoingGame.lineup.away.find(player => player.position === 'Pitcher');

      res.json({
        game: ongoingGame,
        currentPitcher: {
          name: homePitcher.name,
          stats: homePitcher.stats,
          totalPitches: 0 // 임시로 0으로 설정
        },
        homeLineup: ongoingGame.lineup.home,
        awayLineup: ongoingGame.lineup.away
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/previous', async (req, res) => {
    try {
      const lastGame = await Game.findOne({ status: 'finished' }).sort({ _id: -1 }).populate('lineup.home').populate('lineup.away').populate('playerStats.home.player').populate('playerStats.away.player');
      if (!lastGame) {
        return res.status(404).json({ message: 'No previous game found' });
      }

      const events = await Event.find({ game: lastGame._id }).populate('player').sort({ createdAt: 1 });

      res.json({
        game: lastGame,
        events
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
