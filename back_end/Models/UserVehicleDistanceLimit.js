const mongoose = require('mongoose');

const UserVehicleDistanceLimitSchema = new mongoose.Schema({
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  accept_distance: { type: Number, required: true },
});

module.exports = mongoose.model(
  'UserVehicleDistanceLimit',
  UserVehicleDistanceLimitSchema
);
