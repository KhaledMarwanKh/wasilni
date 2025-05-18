const Booking = require('../../Models/Bookings');
const VehicleCostCalculator = require('../../services/VehicleCostCalculator ');
const DriverServices = require('../../services/DriverServices');
const VehicleService = require('../../services/VehicleService');
const turf = require('@turf/turf');
const NearestDriver = require('../../services/NearestDriver');
const DriverSelection = require('../../services/DriverSelection');
const City = require('../../Models/City');
const UserVehicleDistanceLimit = require('../../Models/UserVehicleDistanceLimit');
const catchAsync = require('../../utils/catchAsync');
const ResponseHandler = require('../../utils/responseHandler');
const { changeValidValue } = require('../../services/ChangeValidValueService');
const {
  notifyDriver,
} = require("../../services/Driver'sOrderNotificationService");

const createBooking = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ message: 'missing body of request ' });
  }

  const {
    start_location, // GeoJSON: { type: "Point", coordinates: [lon, lat] }
    end_location, // GeoJSON
    vehicle_type,
    num_of_persons,
    city_name,
  } = req.body;

  // Validate required fields
  if (
    !start_location ||
    !vehicle_type ||
    !end_location ||
    !city_name ||
    !num_of_persons
  ) {
    return ResponseHandler.sendError(next, {
      statusCode: 400,
      message: 'Missing required fields',
    });
  }

  // Calculate ACTUAL trip distance (in km)
  const distanceKm = turf.distance(
    turf.point(start_location.coordinates),
    turf.point(end_location.coordinates),
    { units: 'kilometers' }
  );

  //get vehicle
  const temp = new VehicleService();
  const vehicle = await temp.getVehicle(vehicle_type);
  if (!vehicle) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: `not found this type : ${vehicle_type} in ${city_name}`,
    });
  }

  // city
  const city_data = await City.findOne({ name: city_name }, { _id: 1 });

  // get cost of tirp
  const temp1 = new VehicleCostCalculator(distanceKm, vehicle);
  const cost = await temp1.calculateTripCost();

  // get ids and locations of availble drivers
  const temp2 = new DriverServices(city_data._id, vehicle._id);
  const availableDrivers = await temp2.getAvailableDrivers();

  if (availableDrivers.length === 0) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: `there is no available driver with ${vehicle_type} in ${city_name}`,
    });
  }

  // get limit distance
  const Limit_distance = await UserVehicleDistanceLimit.findOne({
    city_id: city_data._id,
    vehicle_id: vehicle._id,
  });
  const maxDistanceBetweenUserAndDriver = Limit_distance.accept_distance;

  // get nearest driver according limit distance
  // to get closest drivers from start_location
  // where distance between them under specific number
  const temp3 = new NearestDriver(
    start_location,
    availableDrivers,
    maxDistanceBetweenUserAndDriver
  );
  closestDrivers = temp3.closesetDriversOnStart();
  if (closestDrivers.length === 0) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: 'does not find close driver',
    });
  }

  const closestIds = closestDrivers.map((e) => {
    return e.driver_id;
  });

  // get bookings of closest driver
  const closestDriverBookings = await temp2.getBookings(closestIds);

  let result;
  // there is no bookings , so get nearest driver
  if (closestDriverBookings.length === 0) {
    const temp5 = new NearestDriver(
      start_location,
      closestDrivers,
      maxDistanceBetweenUserAndDriver
    );
    result = temp5.getClosestDriver();
  } else {
    // choose the driver that has the least Bookings
    const temp4 = new DriverSelection();
    result = temp4.selectDriverBasedOnBookings(closestDriverBookings);
  }

  if (!result || result.length === 0) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: 'does not find suitable driver ',
    });
  }

  // =======================================
  // === should apply this part togather ===
  // =======================================
  // create new booking
  const booking = new Booking({
    normal_user_id: req.user._id,
    driver_user_id: result.driver_id || null,
    vehicle_id: vehicle._id,
    city_id: city_data._id,
    start_location,
    end_location,
    distance: distanceKm,
    cost,
    booking_time: new Date(),
    num_of_persons: num_of_persons || 1,
    status: 'pending',
  });

  await booking.save();

  // change valid value to 0
  changeValidValue(booking.driver_user_id, 0);
  // send notification to driver in real time
  notifyDriver(booking, city_name, vehicle_type);

  return ResponseHandler.sendSuccess(res, {
    statusCode: 200,
    message: 'the booking is Done',
    data: booking,
  });
});

module.exports = createBooking;
