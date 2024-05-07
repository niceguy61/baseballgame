const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: String,
  number: Number,
  throwingHand: { type: String, enum: ['left', 'right'] },
  battingHand: { type: String, enum: ['left', 'right'] },
  position: { type: String, enum: ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Outfield'] },
  stats: {
    strength: { type: Number, min: 1000, max: 20000 },
    intelligence: { type: Number, min: 1000, max: 20000 },
    mental: { type: Number, min: 1000, max: 20000 },
    agility: { type: Number, min: 1000, max: 20000 },
    battingAverage: { type: Number, min: 0, max: 1, default: 0.25 }, // 타율
    strikeouts: { type: Number, default: 0 }, // 삼진 수
    wins: { type: Number, default: 0 }, // 승 수
    losses: { type: Number, default: 0 }, // 패 수
    era: { type: Number, min: 0, default: 3.0 } // 평균 자책점 (ERA)
  },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
});

module.exports = mongoose.model('Player', PlayerSchema);
