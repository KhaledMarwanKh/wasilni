const express = require('express');
const router = express.Router();
const User = require('../../Models/User');
const authMiddleware = require('../../middleware/authMiddleware');
const catchAsync = require('../../utils/catchAsync');
const ResponseHandler = require('../../utils/responseHandler');

const updateUser = catchAsync (async (req, res, next) => {
  if (!req.body) {
    return ResponseHandler.sendError(next, {
      statusCode: 400,
      message: 'Missing body of request',
    });
  }
  const { name, email, phone, national_num } = req.body;

  const requiredFields = ['name', 'email', 'phone', 'national_num'];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length === 4) {
    return ResponseHandler.sendError(next, {
      statusCode: 422,
      message: `should fill at least one field : ${missingFields.join(', ')}`, // Lists exact fields
    });
  }
  // Find user
  let user = await User.findById(req.params.id);

  if (!user) {
    return ResponseHandler.sendError(next, {
      statusCode: 400,
      message: `not found user!! `,
    });
  }

  // Users can only update their own profile unless admin
  if (req.user._id === req.params.id || req.user.role.toString() !== 'admin') {
    return ResponseHandler.sendError({
      statusCode: 403,
      message: 'Unauthorized',
    });
  }

  // Update fields
  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.national_num = national_num || user.national_num;

  await user.save();

  return ResponseHandler.sendSuccess(res, {
    statusCode: 200,
    message: 'user updated successfully',
  });
});

module.exports = updateUser;
