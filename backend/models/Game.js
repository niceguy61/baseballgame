const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  homeTeam: String,
  awayTeam: String,
  scoreboard: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },
  inning: { type: Number, default: 1 },
  outCount: { type: Number, default: 0 },
  ballCount: { type: Number, default: 0 },
  strikeCount: { type: Number, default: 0 },
  bases: {
    first: { type: Boolean, default: false },
    second: { type: Boolean, default: false },
    third: { type: Boolean, default: false }
  },
  status: { type: String, default: 'scheduled' }, // scheduled, ongoing, finished
  logs: [String],
  lineup: {
    home: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    away: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
  },
  inningScores: {
    home: [{ type: Number, default: 0 }],
    away: [{ type: Number, default: 0 }]
  },
  playerStats: {
    home: [{
      player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      atBats: { type: Number, default: 0 },
      hits: { type: Number, default: 0 },
      walks: { type: Number, default: 0 },
      strikeouts: { type: Number, default: 0 }
    }],
    away: [{
      player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      atBats: { type: Number, default: 0 },
      hits: { type: Number, default: 0 },
      walks: { type: Number, default: 0 },
      strikeouts: { type: Number, default: 0 }
    }]
  }
});

module.exports = mongoose.model('Game', GameSchema);
