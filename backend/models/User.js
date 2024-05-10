const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  hash: String,
  salt: String,
  gold: { type: Number, default: 0 },
  gachaLogs: [{ gachaId: String, item: Object }],
  isAdmin: { type: Boolean, default: false }
});

UserSchema.methods.setPassword = function (password) {
  this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, this.salt);
};

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.hash);
};

module.exports = mongoose.model('User', UserSchema);
