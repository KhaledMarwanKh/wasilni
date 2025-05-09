const User = require('../../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const ResponseHandler = require('../../utils/responseHandler');

module.exports = catchAsync(async (req, res, next) => {
  // 1. Check request body
  if (!req.body || Object.keys(req.body).length === 0) {
    return ResponseHandler.sendError(next, {
      statusCode: 400,
      message: 'Request body is required',
    });
  }

  const {
    name,
    email,
    password,
    phone,
    national_num,
    role_id = '6803efd3a56a088a2fa8ab17',
  } = req.body;

  // 2. Check for missing fields
  const requiredFields = ['name', 'email', 'password', 'phone', 'national_num'];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return ResponseHandler.sendError(next, {
      statusCode: 422,
      message: `Missing required fields: ${missingFields.join(', ')}`, // Lists exact fields
    });
  }

  // 3. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('user Exists', 400));
  }

  // 4. Create new user
  const user = new User({
    name,
    email,
    password, // Make sure to hash this in your User model pre-save hook
    phone,
    national_num,
    role_id,
    valid: false,
  });

  await user.save();

  // 5. Create token
  const token = jwt.sign(
    { id: user._id, role: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return ResponseHandler.sendSuccess(res, {
    statusCode: 201,
    message: 'User created successfully',
    data: {
      user: user.toJSON(),
      token,
    },
  });

});
