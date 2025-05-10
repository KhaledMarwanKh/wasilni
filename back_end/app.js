const express = require('express');
const authRoutes = require('./routes/authRoutes.js');
const CrudUserRoutes = require('./routes/CrudUserRoutes.js');
const vehicleRoutes = require('./routes/vehicleRoutes.js');
const userInfo = require('./routes/userInfoRoutes.js');
const errorController = require('./controllers/errorController.js');
const app = express();

// Middleware
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', CrudUserRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/userInfo', userInfo);

app.use(errorController);

module.exports = app;
