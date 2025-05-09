const express = require('express');
const router = express.Router();
const User = require('../../Models/User');
const authMiddleware = require('../../middleware/authMiddleware');
const catchAsync = require('../../utils/catchAsync');
const ResponseHandler = require('../../utils/responseHandler');

const getUsers = catchAsync(async (req, res, next) => {
  // Check if admin
  if (req.user.role.toString() !== 'admin') {
    return ResponseHandler.sendError(next, {
      statusCode: 403,
      message: 'UnAuthorized',
    });
  }

  const users = await User.find().select('-password');

  return ResponseHandler.sendSuccess(res, {
    statucCode: 200,
    message: 'success',
    data: users,
  });
});

module.exports = getUsers;
