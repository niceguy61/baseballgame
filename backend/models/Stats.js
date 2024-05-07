const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  team: String,
  player: String,
  gamesPlayed: { type: Number, default: 0 },
  hits: { type: Number, default: 0 },
  homeRuns: { type: Number, default: 0 },
  rbis: { type: Number, default: 0 },
  strikeouts: { type: Number, default: 0 },
  walks: { type: Number, default: 0 }
});

module.exports = mongoose.model('Stats', StatsSchema);
