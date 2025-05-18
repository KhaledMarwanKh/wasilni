const mongoose = require('mongoose');
const { pointSchema } = require('./GeoPoint');
const { isValidBookingStatus } = require('../services/Validators');

const bookingSchema = new mongoose.Schema({
  normal_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driver_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleType',
    required: true,
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  start_location: { type: pointSchema, required: true }, //[longitude, latitude]
  end_location: { type: pointSchema, required: true }, //[longitude, latitude]
  distance: {
    type: Number,
    required: true,
    set: (v) => parseFloat(v.toFixed(2)),
  },
  cost: {
    type: Number,
    required: true,
    set: (v) => parseFloat(v.toFixed(2)),
  },
  booking_time: { type: Date, required: true },
  num_of_persons: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

bookingSchema.pre('save', function (next) {
  if (!isValidBookingStatus(this.status)) {
    return ResponseHandler.sendError(next, {
      statusCode: 422,
      message: 'Status must be [pending, accepted, completed, cancelled] ',
    });
  }
  next();
});

bookingSchema.index({ 'start_location.coordinates': '2dsphere' });
bookingSchema.index({ 'end_location.coordinates': '2dsphere' });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
