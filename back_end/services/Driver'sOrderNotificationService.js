const { getIO } = require('./socketService');
const User = require('../Models/User');
const catchAsync = require('../utils/catchAsync');

exports.notifyDriver = catchAsync(async (booking, city_name, vehicle_type) => {
  // Fetch minimal required user data
  const user = await User.findById(booking.normal_user_id)
    .select('name phone')
    .lean();

  // Prepare essential booking data
  const notificationPayload = {
    message: 'You have a new booking!',
    booking: {
      user_name: user.name,
      user_phone: user.phone,
      start_location: booking.start_location,
      end_location: booking.end_location,
      distance: booking.distance,
      cost: booking.cost,
      vehicle: vehicle_type,
      city: city_name,
      status: booking.status,
    },
  };

  // Emit to driver's room
  const io = getIO();
  io.to(`driver_${booking.driver_user_id}`).emit(
    'new_booking',
    notificationPayload
  );
});
