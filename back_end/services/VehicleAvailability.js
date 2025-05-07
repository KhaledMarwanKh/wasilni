const DriverServices = require('./DriverServices');
const User_vehicle = require('../Models/user_vehicle');
class VehicleAvailability {
  constructor(vehicle, city) {
    this.vehicle = vehicle;
    this.city = city;
  }

  async checkAvailability() {
    try {
      const temp = new DriverServices(this.city._id, this.vehicle._id);
      const drivers = await temp.getAvailableDrivers();
      return drivers || []; // Always return an array
    } catch (error) {
      console.error('Error fetching drivers:', error);
      return [];
    }
  }
}

module.exports = VehicleAvailability;
