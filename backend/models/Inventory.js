const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  grade: { type: String, required: true },
  class: { type: String, required: true },
  value: { type: Number, required: true },
  quantity: { type: Number, default: 1 }
});

// inventorySchema.index({ userId: 1, grade: 1, class: 1 }, { unique: true });
inventorySchema.index({ userId: 1, grade: 1, class: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
