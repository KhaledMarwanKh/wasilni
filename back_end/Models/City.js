const mongoose = require('mongoose');
const citySchema = new mongoose.Schema({
  name: { type: String, required: true['name of city is required'] },
});

const City = mongoose.model('City', citySchema);

module.exports = City;
