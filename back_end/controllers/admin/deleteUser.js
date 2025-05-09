const express = require('express');
const router = express.Router();
const User = require('../../Models/User');
const authMiddleware = require('../../middleware/authMiddleware');
const catchAsync = require('../../utils/catchAsync');
const ResponseHandler = require('../../utils/responseHandler');

const deleteUser = catchAsync(async (req, res, next) => {
  // Only admin can delete users
  if (req.user.role.toString() !== 'admin') {
    return ResponseHandler.sendError(next, {
      statusCode: 403,
      message: 'Unauthorized',
    });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: 'user not found',
    });
  }

  return ResponseHandler.sendSuccess(res, {
    statusCode: 200,
    message: 'User deleted successfully',
  });
});

module.exports = deleteUser;
