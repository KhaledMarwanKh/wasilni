const mongoose = require('mongoose');
const UserVehicle = require('../Models/user_vehicle');
const seedUser_vehicles = async (cities, users, vehicles) => {
  const vehiclesData = [
    {
      vehicle_id: new mongoose.Types.ObjectId(vehicles[0]._id.toString()),
      driver_id: new mongoose.Types.ObjectId(users[0]._id.toString()),
      city_id: new mongoose.Types.ObjectId(cities[0]._id.toString()),
      location: {
        type: 'Point',
        coordinates: [50.0036, 20.0056], // NYC coordinates
      },
      model: 'Toyota Camry',
      license_plate: 'ABC123',
      year: 2020,
      capacity: 4,
      work_period_start: '08:00',
      work_period_end: '17:00',
      valid: true,
    },
    {
      vehicle_id: new mongoose.Types.ObjectId(vehicles[0]._id.toString()),
      driver_id: new mongoose.Types.ObjectId(users[1]._id.toString()),
      city_id: new mongoose.Types.ObjectId(cities[0]._id.toString()),
      location: {
        type: 'Point',
        coordinates: [49.99325, 19.9895], // LA coordinates
      },
      model: 'Honda Accord',
      license_plate: 'XYZ789',
      year: 2019,
      capacity: 4,
      work_period_start: '09:00',
      work_period_end: '18:00',
      valid: true,
    },
  ];

  try {
    // Clear existing data
    await UserVehicle.deleteMany({}).exec();
    console.log('🧹 Existing user_vehicles cleared');

    // Insert vehicles
    const Uservehicles = await UserVehicle.insertMany(vehiclesData);
    console.log(`✅ ${Uservehicles.length} user_vehicles seeded`);
  } catch (error) {
    console.log(`Seeding user vehicle failed ${error}`);
  }
};

module.exports = seedUser_vehicles;
