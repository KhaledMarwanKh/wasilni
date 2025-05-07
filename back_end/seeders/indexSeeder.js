const mongoose = require('mongoose');
const fastDrop = require('../services/dropData');
const seedVehicles = require('./vehicleSeeder');
const seedUsers = require('./userSeeder');
const seedUser_vehicles = require('./user_vehicleSeeder');
const seedCity = require('./citySeeder');
const seedUserVehicleDistanceSeeder = require('./userVehicleDistanceLimitSeeder');

const runSeeders = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });

    console.log('delete existed data');
    // drop data
    await fastDrop();

    // Run seeders sequentially
    const vehicles_types = await seedVehicles();
    const users = await seedUsers();
    const cities = await seedCity();

    await seedUserVehicleDistanceSeeder(cities, vehicles_types);
    await seedUser_vehicles(cities, users, vehicles_types);

    console.log('✨ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding index failed:', error.message, error);
    process.exit(1);
  }
};

runSeeders();
