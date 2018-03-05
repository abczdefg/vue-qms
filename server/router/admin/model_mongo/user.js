/**
 * 用户信息
 */
const mongoose = require('../../util/db.js');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    unique: true
  }
}, {
  collection: 'user'
});

module.exports = mongoose.model('User', UserSchema);
