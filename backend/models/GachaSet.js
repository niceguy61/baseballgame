const mongoose = require('mongoose');

const gachaSetSchema = new mongoose.Schema({
  setId: String,
  name: String,
  items: [{ grade: String, class: String, value: Number, probability: Number }]
});

module.exports = mongoose.model('GachaSet', gachaSetSchema);
