const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  description: { type: String },
  percent: { type: Number, required: true, default: 0 },
  cost_in_per_KM: { type: Number, required: true, min: 0 },
});

// Create default vehicle types if they don't exist
vehicleSchema.statics.initializeVehicleTypes = async function () {
  const vehicleTypes = [
    {
      name: 'Regular Car',
      description: 'Standard passenger car',
      percent: 0.03,
    },
    {
      name: 'Luxury Car',
      description: 'Premium service vehicle',
      percent: 0.1,
    },
    { name: 'Motorcycle', description: 'Two-wheeled vehicle', percent: 0.02 },
    { name: 'Van', description: 'Special vehicle', percent: 0.04 },
  ];

  for (const vt of vehicleTypes) {
    await this.findOneAndUpdate(
      { name: vt.name },
      { $setOnInsert: vt },
      { upsert: true, new: true }
    );
  }
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
