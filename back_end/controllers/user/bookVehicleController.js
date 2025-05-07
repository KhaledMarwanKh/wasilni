const Booking = require('../../Models/Bookings');
const VehicleCostCalculator = require('../../services/VehicleCostCalculator ');
const DriverServices = require('../../services/DriverServices');
const VehicleService = require('../../services/VehicleService');
const turf = require('@turf/turf');
const NearestDriver = require('../../services/NearestDriver');
const DriverSelection = require('../../services/DriverSelection');
const City = require('../../Models/City');
const UserVehicleDistanceLimit = require('../../Models/UserVehicleDistanceLimit');
const createBooking = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'missing body of request ' });
    }

    const {
      start_location, // GeoJSON: { type: "Point", coordinates: [lon, lat] }
      end_location, // GeoJSON
      vehicle_type,
      num_of_persons,
      city_name,
      // MDBUAD: maxDistanceBetweenUserAndDriver,
    } = req.body;

    // Validate required fields
    if (
      !start_location ||
      !vehicle_type ||
      !end_location ||
      !city_name ||
      !num_of_persons
    ) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    // Calculate ACTUAL trip distance (in km)
    const distanceKm = turf.distance(
      turf.point(start_location.coordinates),
      turf.point(end_location.coordinates),
      { units: 'kilometers' }
    );

    const temp = new VehicleService();
    const vehicle = await temp.getVehicle(vehicle_type);
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: `not found this type : ${vehicle_type} in ${city}` });
    }
    const temp1 = new VehicleCostCalculator(distanceKm, vehicle);

    const city_data = await City.findOne({ name: city_name }, { _id: 1 });
    // get cost of tirp
    const cost = await temp1.calculateTripCost();
    const temp2 = new DriverServices(city_data._id, vehicle._id);
    // get ids and locations of availble drivers
    const availableDrivers = await temp2.getAvailableDrivers();

    if (availableDrivers.length === 0) {
      return res.status(404).json({
        message: `There is no available diriver with: ${vehicle_type} in ${city}`,
      });
    }

    const Limit_distance = await UserVehicleDistanceLimit.findOne({
      city_id: city_data._id,
      vehicle_id: vehicle._id,
    });

    const maxDistanceBetweenUserAndDriver = Limit_distance.accept_distance;

    const temp3 = new NearestDriver(
      start_location,
      availableDrivers,
      maxDistanceBetweenUserAndDriver
    );
    //choosing driver according:
    // 1- the distacne between the user_vehicle (driver) and start_location less than 2km
    // 2- then choose less one has orders last 10 days

    // to get closest drivers from start_location
    closestDrivers = temp3.closesetDriversOnStart();
    if (closestDrivers.length === 0) {
      res.status(404).json({ message: 'does not find close drivers' });
    }

    const closestIds = closestDrivers.map((e) => {
      return e.driver_id;
    });

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
      const temp4 = new DriverSelection();
      result = temp4.selectDriverBasedOnBookings(closestDriverBookings);
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'does not find suitable driver' });
    }

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
    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = createBooking;
