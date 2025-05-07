const Vehicle = require('../Models/Vehicle');

class VehicleService {
  async getVehicle(vehicle_type) {
    return await Vehicle.findOne(
      { type: vehicle_type },
      { _id: 1, cost_in_per_KM: 1, percent: 1, type: 1 }
    ).lean();
  }
}

module.exports = VehicleService;
