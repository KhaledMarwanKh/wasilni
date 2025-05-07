// Email regex (RFC 5322 compliant)
exports.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone regex (adjust based on requirements)
exports.phoneRegex = /^\+?[\d\s-]{8,15}$/;

// Password requirements (min 8 chars, 1 uppercase, 1 number)
exports.passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;