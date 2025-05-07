// registerController.js
const User = require('../../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {

  try {
    if (!req.body) {
      return res.status(400).json({ message: 'request body is required' });
    }
    const {
      name,
      email,
      password,
      phone,
      national_num,
      role_id = '6803efd3a56a088a2fa8ab17',
    } = req.body;

    // 3. Check for missing fields
    const requiredFields = [
      'name',
      'email',
      'password',
      'phone',
      'national_num',
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(422).json({
        message: 'Missing required fields',
        missingFields,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }


    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      national_num,
      role_id,
      valid: false,
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'user created successfully', user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
