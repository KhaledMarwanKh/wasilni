// models/GeoPoint.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point',
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length === 2,
      message: 'Coordinates must be an array of [longitude, latitude]',
    },
  },
});

// Enable geospatial indexing
pointSchema.index({ coordinates: '2dsphere' });

// export schema not model
module.exports = { pointSchema };
