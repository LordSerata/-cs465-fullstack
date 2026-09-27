const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

const Trip = require('./travlr');

const trips = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../data/trips.json'), 'utf8')
);

mongoose.connect(dbURI)
  .then(() => {
    console.log(`Connected to ${dbURI}`);
    return Trip.deleteMany({});
  })
  .then(() => {
    console.log('Existing trips removed');
    return Trip.insertMany(trips);
  })
  .then((insertedTrips) => {
    console.log(`Seeded ${insertedTrips.length} trips`);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('Connection closed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding error: ', err);
    process.exit(1);
  });