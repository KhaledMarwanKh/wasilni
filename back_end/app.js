const express = require('express');
const authRoutes = require('./routes/authRoutes.js');
const CrudUserRoutes = require('./routes/CrudUserRoutes.js');
const vehicleRoutes = require('./routes/vehicleRoutes.js');
const driverRoutes = require('./routes/driverRoutes.js');
const errorController = require('./controllers/errorController.js');
const app = express();

// Middleware
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', CrudUserRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/driver', driverRoutes);
app.use(errorController);

module.exports = app;
