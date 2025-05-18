const { distance } = require('@turf/turf');
const Booking = require('../../Models/Bookings');
const catchAsync = require('../../utils/catchAsync');
const ResponseHandler = require('../../utils/responseHandler');
const { ObjectId } = require('mongoose').Types;

const showBookings = catchAsync(async (req, res, next) => {
  const driverOrUser = req.user;
  if (!driverOrUser) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: 'not found driver',
    });
  }

  console.log('driver ');
  driver = driverOrUser;
  const bookingsByStatus = await Booking.aggregate([
    // Match bookings for the current user/driver
    {
      $match: {
        // like WHERE
        [driverOrUser.role === 'driver' ? 'driver_user_id' : 'normal_user_id']:
          new ObjectId(driverOrUser._id),
      },
    },

    // Lookup city name (replace city_id with city name)
    {
      $lookup: {
        // like JOIN
        from: 'cities',
        localField: 'city_id',
        foreignField: '_id',
        as: 'cityData',
      },
    },
    { $unwind: '$cityData' },

    // Lookup opposite party details (driver or user)
    {
      $lookup: {
        // like SELECT
        from: 'users',
        localField:
          driverOrUser.role === 'driver' ? 'normal_user_id' : 'driver_user_id',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              name: 1,
              phone: 1,
              _id: 0,
            },
          },
        ],
        as: 'oppositeParty',
      },
    },
    { $unwind: '$oppositeParty' },

    // Format the output
    {
      $project: {
        status: 1,
        // Convert booking_time to readable format
        booking_time: {
          $dateToString: {
            format: '%B %d, %Y, %H:%M ', // e.g. "May 06, 2025, 01:53 PM"
            date: '$booking_time',
            timezone: 'UTC', // Adjust if you need local time
          },
        },
        city: '$cityData.name', // Replace city_id with city name
        Name: '$oppositeParty.name',
        Phone: '$oppositeParty.phone',
      },
    },

    // Group by status (case-insensitive)
    {
      $group: {
        _id: { $toLower: '$status' },
        bookings: { $push: '$$ROOT' },
      },
    },
  ]);

  if (bookingsByStatus.length === 0) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: 'you do not have bookings ',
    });
  }

  return ResponseHandler.sendSuccess(res, {
    statusCode: 200,
    message: 'success',
    data: bookingsByStatus,
  });
});

module.exports = showBookings;
