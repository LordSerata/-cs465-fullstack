const passport = require('passport');
const User = require('../models/user');

// POST: /register - makes a new user and sends back a token
const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email
    });
    user.setPassword(req.body.password);
    await user.save();
    const token = user.generateJWT();
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(400).json(err);
  }
};

// POST: /login - checks email and password and sends back a token
const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(404).json(err);
    }
    if (user) {
      const token = user.generateJWT();
      return res.status(200).json({ token });
    }
    return res.status(401).json(info);
  })(req, res);
};

module.exports = {
  register,
  login
};