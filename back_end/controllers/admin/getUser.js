const express = require('express');
const router = express.Router();
const User = require('../../Models/User');
const authMiddleware = require('../../middleware/authMiddleware');
const catchAsync = require('../../utils/catchAsync');
const ResponseHandler = require('../../utils/responseHandler');
// Get single user
const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return ResponseHandler.sendError(next, {
      statusCode: 400,
      message: 'not found your email, please register',
    });
  }

  // Users can only access their own profile unless admin
  if (req.user.id !== req.params.id && req.user.role.toString() !== 'admin') {
    return ResponseHandler.sendError(next, {
      statusCode: 403,
      message: 'Unauthorized',
    });
  }

  return ResponseHandler.sendSuccess(res, {
    statusCode: 200,
    message: 'success',
    data: user,
  });
});

module.exports = getUser;
