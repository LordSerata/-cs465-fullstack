const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Checks for a valid token before letting a request through
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Auth header required' });
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Auth header must be: Bearer <token>' });
  }
  jwt.verify(parts[1], process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'Token validation error' });
    }
    req.payload = payload;
    next();
  });
}

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(authenticateJWT, tripsController.tripsAddTrip);

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip)
  .delete(authenticateJWT, tripsController.tripsDeleteTrip);

module.exports = router;