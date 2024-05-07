const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  team: { type: String, enum: ['home', 'away'] },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  eventType: {
    type: String,
    enum: [
      'Single', 'Double', 'Triple', 'Home Run',
      'Strike Out', 'Walk', 'Hit By Pitch', 'Ground Out', 'Fly Out'
    ]
  },
  inning: Number,
  outCount: Number,
  ballCount: Number,
  strikeCount: Number,
  bases: {
    first: { type: Boolean, default: false },
    second: { type: Boolean, default: false },
    third: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
