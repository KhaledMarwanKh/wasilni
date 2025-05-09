const express = require('express');
const router = express.Router();
const User = require('../../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ResponseHandler = require('../../utils/responseHandler');
const catchAsync = require('../../utils/catchAsync');

module.exports = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return ResponseHandler.sendError(next, {
      statusCode: 400,
      message: 'Missing body of request',
    });
  }
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return ResponseHandler.sendError(next, {
      statusCode: 400,
      message: 'not found your email, please register',
    });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return ResponseHandler.sendError(next, {
      statusCode: 400,
      message: 'Invalid credentials',
    });
  }
  // Create token
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return ResponseHandler.sendSuccess(res, {
    statusCode: 200,
    message: 'Logged in successfully',
    data: {
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        national_num: user.national_num,
        role: user.role_id,
      },
      token,
    },
  });
});
