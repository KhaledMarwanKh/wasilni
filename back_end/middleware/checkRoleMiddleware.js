// middleware/checkRole.js
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No user data' });
    }

    
    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Forbidden: Insufficient permissions' });
    }

    next(); // Proceed if role is allowed
  };
};

module.exports = checkRole;
