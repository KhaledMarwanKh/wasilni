const VehicleCostCalculator = require('../../services/VehicleCostCalculator ');
const VehicleAvailability = require('../../services/VehicleAvailability');
const VehicleService = require('../../services/VehicleService');
const City = require('../../Models/City');

const showCostOfVehicl = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(422).json({ message: 'missing body of request' });
    }

    const { vehicle_type, distanceOfTrip, city_name } = req.body;

    // validate
    if (!vehicle_type || !distanceOfTrip || !city_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const temp = new VehicleService();
    const vehicle = await temp.getVehicle(vehicle_type);
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: `not found this type : ${vehicle_type} ` });
    }
    // calculate the cost of trip
    const temp1 = new VehicleCostCalculator(distanceOfTrip, vehicle);
    const cost = await temp1.calculateTripCost();

    // find city :
    city_data = await City.findOne({ name: city_name }, { _id: 1 });
    if (!city_data) {
      return res.status(404).json({ message: `not found city : ${city_name}` });
    }
    // check if there is valid vehicle or not
    available = false;
    const temp2 = new VehicleAvailability(vehicle, city_data);
    const existed = await temp2.checkAvailability();

    console.log('existed : ', existed);
    if (existed.length > 0) {
      available = true;
      return res.status(200).json({
        data: cost,
        available: available,
        message: 'success!',
      });
    } else {
      return res
        .status(404)
        .json({ message: `there is no any ${vehicle_type} currently` });
    }
  } catch (error) {
    console.error('checking failed error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = showCostOfVehicl;
