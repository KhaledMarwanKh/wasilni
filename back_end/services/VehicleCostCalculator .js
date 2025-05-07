const Vehicle = require('../Models/Vehicle');
const User_vehicle = require('../Models/user_vehicle');
const VehicleService = require('./VehicleService');

class VehicleCostCalculator {
  constructor(distance, vehicle) {
    this.distance = distance;
    this.vehicle = vehicle;
  }

  async calculateTripCost() {
    const baseCost = this.distance * this.vehicle.cost_in_per_KM;
    const additionalCost = this.vehicle.percent * this.vehicle.cost_in_per_KM;
    return baseCost + additionalCost;
  }
}

module.exports = VehicleCostCalculator;
