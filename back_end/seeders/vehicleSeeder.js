const Vehicle = require('../Models/Vehicle');

const vehicleTypes = [
  {
    type: 'Regular Car',
    description: 'Standard passenger car',
    percent: 0.03,
    cost_in_per_KM: 5.0,
  },
  {
    type: 'Luxury Car',
    description: 'Premium service vehicle',
    percent: 0.1,
    cost_in_per_KM: 10.0,
  },
  {
    type: 'Motorcycle',
    description: 'Two-wheeled vehicle',
    percent: 0.02,
    cost_in_per_KM: 3.0,
  },
  {
    type: 'Van',
    description: 'Special vehicle',
    percent: 0.04,
    cost_in_per_KM: 7.0,
  },
];

async function seedVehicles() {
  try {
    let vehicle_types = {};
    // Check if any vehicles already exist
    const existingVehicles = await Vehicle.find();
    if (existingVehicles.length === 0) {
      // Clear existing data
      await Vehicle.deleteMany({}).exec();
      console.log('🧹 Existing vehicles cleared');

      // Insert all vehicle types
      vehicle_types = await Vehicle.insertMany(vehicleTypes);
      console.log(`✅ ${vehicleTypes.length} Vehicles seeded successfully!`);
    }
    return vehicle_types;
  } catch (error) {
    console.error('❌ Seeding vehicles failed:', error);
  } finally {
  }
}

// Execute the seeder
module.exports = seedVehicles;
