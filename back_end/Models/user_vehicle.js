const mongoose = require('mongoose');
const { pointSchema } = require('./GeoPoint');
const {
  timeRegex,
  validateTimeFormat,
  validateWorkPeriod,
} = require('../services/Validators');
const ResponseHandler = require('../utils/responseHandler');

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
  work_period_start: {
    type: String,
    validate: {
      validator: timeRegex,
      message: (props) => `${props.value} is not a valid time format (HH:MM)`,
    },
  },
  work_period_end: {
    type: String,
    validate: {
      validator: timeRegex,
      message: (props) => `${props.value} is not a valid time format (HH:MM)`,
    },
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

user_vehicleSchema.pre('save', function (next) {
  if (this.work_period_start && this.work_period_end) {
    if (!validateWorkPeriod(this.work_period_start, this.work_period_end)) {
      return ResponseHandler.sendError(next, {
        statusCode: 422,
        message: 'Work period end time must be after start time',
      });
    }
  }
  next();
});

const User_vehicle = mongoose.model('user_vehicle', user_vehicleSchema);

module.exports = User_vehicle;
