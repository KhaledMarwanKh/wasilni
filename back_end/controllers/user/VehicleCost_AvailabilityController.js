const VehicleCostCalculator = require('../../services/VehicleCostCalculator ');
const VehicleAvailability = require('../../services/VehicleAvailability');
const VehicleService = require('../../services/VehicleService');
const City = require('../../Models/City');
const catchAsync = require('../../utils/catchAsync');
const ResponseHandler = require('../../utils/responseHandler');

const showCostOfVehicl = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return ResponseHandler.sendError(next, {
      statusCode: 422,
      message: 'missing body of request',
    });
  }

  const { vehicle_type, distanceOfTrip, city_name } = req.body;

  // validate
  if (!vehicle_type || !distanceOfTrip || !city_name) {
    return ResponseHandler.sendError(next, {
      statusCode: 400,
      meesage: 'Missing required fields',
    });
  }

  const temp = new VehicleService();
  const vehicle = await temp.getVehicle(vehicle_type);
  if (!vehicle) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: `not found this type ${vehicle_type}`,
    });
  }
  // calculate the cost of trip
  const temp1 = new VehicleCostCalculator(distanceOfTrip, vehicle);
  const cost = await temp1.calculateTripCost();

  // find city :
  city_data = await City.findOne({ name: city_name }, { _id: 1 });

  if (!city_data) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: `not found city: ${city_name}`,
    });
  }
  // check if there is valid vehicle or not
  available = false;
  const temp2 = new VehicleAvailability(vehicle, city_data);
  const existed = await temp2.checkAvailability();

  if (existed.length > 0) {
    available = true;
    return ResponseHandler.sendSuccess(res, {
      statusCode: 200,
      message: 'success',
      data: cost,
    });
  } else {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: `there is not any ${vehicle_type} currently`,
    });
  }
});

module.exports = showCostOfVehicl;
