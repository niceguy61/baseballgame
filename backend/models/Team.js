const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: String,
  emblem: String,
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
});

module.exports = mongoose.model('Team', TeamSchema);
