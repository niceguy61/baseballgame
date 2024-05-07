const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  emblem: { type: String, default: '' },
  players: [{
    name: String,
    position: String
  }]
});

module.exports = mongoose.model('Team', TeamSchema);
