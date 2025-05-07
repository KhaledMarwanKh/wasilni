const express = require('express');
const router = express.Router();
const User = require('../../Models/User');
const authMiddleware = require('../../middleware/authMiddleware');

const getUsers = async (req, res) => {
  try {
    // Check if admin
    if (req.user.role.toString() !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getUsers;
