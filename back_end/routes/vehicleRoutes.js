const express = require('express');
const router = express.Router();
const cost_availabilityVehicle = require('../controllers/user/VehicleCost_AvailabilityController');
const bookVehicle = require('../controllers/user/bookVehicleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.use(authMiddleware);
router.use(checkRole('user'));

router.get('/check', cost_availabilityVehicle);
router.post('/book', bookVehicle);

module.exports = router;
