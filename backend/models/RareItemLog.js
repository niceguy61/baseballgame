const mongoose = require('mongoose');

const rareItemLogSchema = new mongoose.Schema({
  gachaId: String,
  userId: mongoose.Schema.Types.ObjectId,
  item: Object
});

module.exports = mongoose.model('RareItemLog', rareItemLogSchema);
