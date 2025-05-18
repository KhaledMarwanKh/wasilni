const mongoose = require('mongoose');
// Email regex (RFC 5322 compliant)
exports.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone regex (adjust based on requirements)
exports.phoneRegex = /^\+?[\d\s-]{8,15}$/;

// Password requirements (min 8 chars, 1 uppercase, 1 number)
exports.passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

// for user_vehicle model
exports.timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

exports.validateTimeFormat = (time) => {
  return this.timeRegex.test(time);
};

// for Bookings modle :
exports.isValidBookingStatus = (status) => {
  const allowedStatuses = ['pending', 'accepted', 'completed', 'cancelled'];
  return allowedStatuses.includes(status);
};
exports.validateWorkPeriod = (start, end) => {
  if (!start || !end) return true;

  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;
  return startTotal < endTotal;
};

exports.validateStatusFromDriver = (status) => {
  const allowedStatuses = ['accepted', 'cancelled', 'completed'];

  if (allowedStatuses.includes(status)) {
    return true;
  }

  return false;
};

exports.validateId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  return true;
};

exports.Ownership = (driverId, driverIDInBooking) => {
  if (!driverId || !driverIDInBooking) return false;

  console.log('Comparison:', {
    driverId,
    driverIDInBooking,
    type1: typeof driverId,
    type2: typeof driverIDInBooking,
    isObj1: driverId && typeof driverId === 'object',
    isObj2: driverIDInBooking && typeof driverIDInBooking === 'object',
  });

  // Extract ID from object if needed
  const id2 =
    typeof driverIDInBooking === 'object'
      ? driverIDInBooking._id || driverIDInBooking.id || driverIDInBooking
      : driverIDInBooking;

  // Handle ObjectId cases
  if (driverId.equals) return driverId.equals(id2);
  if (id2.equals) return id2.equals(driverId);

  // Final string comparison
  return String(driverId).trim() === String(id2).trim();
};
