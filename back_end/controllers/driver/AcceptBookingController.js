const Booking = require('../../Models/Bookings');
const catchAsync = require('../../utils/catchAsync');
const ResponseHandler = require('../../utils/responseHandler');
const {
  validateStatusFromDriver,
  validateId,
  Ownership,
} = require('../../services/Validators');
const { changeValidValue } = require('../../services/ChangeValidValueService');

const changeBookingsStatus = catchAsync(async (req, res, next) => {
  if (!req.body || !req.body.status) {
    return ResponseHandler.sendError(next, {
      statusCode: 400,
      message: 'body of request and status are required',
    });
  }

  const id = req.params.id;
  const status = req.body.status;
  driver = req.user;

  if (!driver) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: 'driver not found',
    });
  }
  if (!validateStatusFromDriver(status)) {
    return ResponseHandler.sendError(next, {
      codeStatus: 400,
      message: 'status should be [cancelled or accepted] just',
    });
  }
  if (!validateId(id)) {
    return ResponseHandler.sendError(next, {
      sendCode: 400,
      message: 'Invalid Id',
    });
  }

  const booking = await Booking.findById(id)
    .select('status _id driver_user_id')
    .populate('normal_user_id', ['name', 'phone']);

  console.log('driID ', booking.driver_user_id._id);
  if (!Ownership(driver._id, booking.driver_user_id._id)) {
    return ResponseHandler.sendError(next, {
      statusCode: 403,
      message: 'You are not authorized to modify this booking',
    });
  }

  if (booking.length === 0) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: 'not found the booking',
    });
  }

  booking.status = status;
  await booking.save();

  if (status === 'accepted') {
    // change valid value for driver to 0
    await changeValidValue(booking.driver_user_id, 0);
  } else if (status === 'completed') {
    // change valid value for driver to 1
    await changeValidValue(booking.driver_user_id, 1);
  } else {
    // the status is cancelled you should resend booking request to another drver
  }
  return ResponseHandler.sendSuccess(res, {
    message: `Booking status updated to ${status}`,
  });
});

module.exports = changeBookingsStatus;
