const User_vehicle = require('../Models/user_vehicle');
const VehicleAvailability = require('./VehicleAvailability');
const Booking = require('../Models/Bookings');

class DriverServices {
  constructor(cityId, vehicleId) {
    this.cityId = cityId;
    this.vehicleId = vehicleId;
  }

  async getAvailableDrivers() {
    return User_vehicle.find(
      {
        valid: true,
        vehicle_id: this.vehicleId,
        city_id: this.cityId,
      },
      {
        driver_id: 1,
        'location.coordinates': 1,
      }
    ).lean();
  }

  async getBookings(driverIds) {
    const recentBookings = await Booking.aggregate([
      {
        $match: {
          driver_user_id: { $in: driverIds },
          createdAt: { $gte: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
          status: { $in: ['accepted', 'completed'] },
        },
      },
      {
        $group: {
          _id: '$driver_user_id',
          bookingCount: { $sum: 1 },
        },
      },
      {
        $project: {
          driver_id: '$_id',
          bookingCount: 1,
          _id: 0,
        },
      },
    ]);
    return recentBookings;
  }
}

module.exports = DriverServices;
