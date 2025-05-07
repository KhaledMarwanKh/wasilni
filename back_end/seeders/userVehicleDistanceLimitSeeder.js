const mongoose = require('mongoose');
const UserVehicleDistanceLimit = require('../Models/UserVehicleDistanceLimit');
const seedUserVehicleDistanceSeeder = async (cities, vehicles) => {
  const Data = [
    // Damascus
    {
      vehicle_id: new mongoose.Types.ObjectId(vehicles[0]._id.toString()),
      city_id: new mongoose.Types.ObjectId(cities[0]._id.toString()),
      accept_distance: 2,
    },
    {
      vehicle_id: new mongoose.Types.ObjectId(vehicles[1]._id.toString()),
      city_id: new mongoose.Types.ObjectId(cities[0]._id.toString()),
      accept_distance: 2,
    },
    {
      vehicle_id: new mongoose.Types.ObjectId(vehicles[2]._id.toString()),
      city_id: new mongoose.Types.ObjectId(cities[0]._id.toString()),
      accept_distance: 2,
    },
    // Homs
    {
      vehicle_id: new mongoose.Types.ObjectId(vehicles[0]._id.toString()),
      city_id: new mongoose.Types.ObjectId(cities[1]._id.toString()),
      accept_distance: 3,
    },
    {
      vehicle_id: new mongoose.Types.ObjectId(vehicles[1]._id.toString()),
      city_id: new mongoose.Types.ObjectId(cities[1]._id.toString()),
      accept_distance: 3,
    },
    {
      vehicle_id: new mongoose.Types.ObjectId(vehicles[2]._id.toString()),
      city_id: new mongoose.Types.ObjectId(cities[1]._id.toString()),
      accept_distance: 3,
    },
  ];

  try {
    // Clear existing data
    await UserVehicleDistanceLimit.deleteMany({}).exec();
    console.log('🧹 Existing usVeDiLi cleared');

    // Insert
    await UserVehicleDistanceLimit.insertMany(Data);

    console.log(`✅ ${Data.length} usVeDiLi seeded`);
  } catch (error) {
    console.error('❌ Seeding usVeDiLi failed:', error);
  }
};

module.exports = seedUserVehicleDistanceSeeder;
