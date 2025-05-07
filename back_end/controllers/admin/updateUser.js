const express = require('express');
const router = express.Router();
const User = require('../../Models/User');
const authMiddleware = require('../../middleware/authMiddleware');

const updateUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(422).json({ message: 'missing body of request' });
    }
    const { name, email, phone, national_num } = req.body;

    if (!name && !email && !phone && !national_num) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Find user
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Users can only update their own profile unless admin
    if (
      req.user._id === req.params.id ||
      req.user.role.toString() !== 'admin'
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.national_num = national_num || user.national_num;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      national_num: user.national_num,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = updateUser;
