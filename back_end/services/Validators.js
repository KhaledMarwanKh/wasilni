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

exports.validateWorkPeriod = (start, end) => {
  if (!start || !end) return true;

  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;

  return startTotal < endTotal;
};
