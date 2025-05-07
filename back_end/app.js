const express = require('express');
const authRoutes = require('./routes/authRoutes.js');
const CrudUserRoutes = require('./routes/CrudUserRoutes.js');
const vehicleRoutes = require('./routes/vehicleRoutes.js');
const app = express();

// Middleware
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', CrudUserRoutes);
app.use('/api/vehicle', vehicleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

module.exports = app;
