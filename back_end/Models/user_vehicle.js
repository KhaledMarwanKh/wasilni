const mongoose = require('mongoose');
const { pointSchema } = require('./GeoPoint');

const user_vehicleSchema = new mongoose.Schema({
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: {
    type: pointSchema,
    required: true,
  }, //[longitude, latitude]
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  valid: { type: Boolean, default: true },
  model: { type: String, required: true },
  license_plate: { type: String, required: true, unique: true },
  year: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear(),
  },
  capacity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User_vehicle = mongoose.model('user_vehicle', user_vehicleSchema);

module.exports = User_vehicle;
