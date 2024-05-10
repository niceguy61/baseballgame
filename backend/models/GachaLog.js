const mongoose = require('mongoose');

const gachaLogSchema = new mongoose.Schema({
  gachaId: String,
  userId: mongoose.Schema.Types.ObjectId,
  item: Object
});

module.exports = mongoose.model('GachaLog', gachaLogSchema);
