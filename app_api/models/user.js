const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  hash: String,
  salt: String
});

// Make a random salt, then hash the password with it (one way, can't be reversed)
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Hash the password they typed with their saved salt and see if it matches
userSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

// Make a signed token that expires in 1 hour
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const User = mongoose.model('users', userSchema);
module.exports = User;