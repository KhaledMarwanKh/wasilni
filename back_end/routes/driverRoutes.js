const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const checkRole = require('../middleware/checkRoleMiddleware.js');
const showBookings = require('../controllers/driver/User&DriversBookingsController.js');
const changeBookingsStatus = require('../controllers/driver/AcceptBookingController.js');

// middlewares
router.use(authMiddleware);
router.use(checkRole(['driver', 'user']));

// routes
router.get('/bookings', showBookings);
router.post('/change-status/:id', changeBookingsStatus);

module.exports = router;
