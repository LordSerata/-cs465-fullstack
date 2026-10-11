const Trip = require('../models/travlr');

// GET: /trips - lists all trips
const tripsList = async (req, res) => {
  try {
    const q = await Trip.find({}).exec();
    if (!q) {
      return res.status(404).json({ message: 'No trips found' });
    }
    return res.status(200).json(q);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// GET: /trips/:tripCode - returns a single trip matching the code param
const tripsFindByCode = async (req, res) => {
  try {
    const q = await Trip.find({ code: req.params.tripCode }).exec();
    if (!q) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    return res.status(200).json(q);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// POST: /trips - adds a new trip
const tripsAddTrip = async (req, res) => {
  try {
    const trip = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });
    return res.status(201).json(trip);
  } catch (err) {
    return res.status(400).json(err);
  }
};

// PUT: /trips/:tripCode - updates an existing trip
const tripsUpdateTrip = async (req, res) => {
  try {
    const q = await Trip.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true }
    ).exec();
    if (!q) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    return res.status(200).json(q);
  } catch (err) {
    return res.status(400).json(err);
  }
};

// DELETE: /trips/:tripCode - deletes a trip
const tripsDeleteTrip = async (req, res) => {
  try {
    const q = await Trip.findOneAndDelete({ code: req.params.tripCode }).exec();
    if (!q) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    return res.status(204).json(null);
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};