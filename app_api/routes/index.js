const express = require('express');
const router = express.Router();

const tripsCtrl = require('../controllers/trips');

// trips routes
router
  .route('/trips')
  .get(tripsCtrl.tripsList);

router
  .route('/trips/:tripCode')
  .get(tripsCtrl.tripsFindByCode);

module.exports = router;