

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    default: 0
  },
  preferences: {
    type: [String], // Array of strings representing user preferences
    required: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
