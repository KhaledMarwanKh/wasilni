const mongoose = require('mongoose');
require('dotenv').config();

const fastDrop = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 60000,
      });
    }

    // 2. List of collections to reset
    const collections = [
      'vehicles',
      'users',
      'user_vehicle',
      'cities',
      'bookings',
      'userVehicleDistanceLimit',
    ];

    // 3. Parallel collection drops
    await Promise.all(
      collections.map(async (name) => {
        try {
          await mongoose.connection.db.collection(name).drop();
          console.log(`⚡ Dropped ${name} collection`);
        } catch (err) {
          if (err.code !== 26) throw err; // Ignore "ns not found" errors
        }
      })
    );

    console.log('🚀 Database reset & seeded in milliseconds');
  } catch (error) {
    console.log(`Failed drop data msg :${error.message}`);
  }
};

module.exports = fastDrop;
