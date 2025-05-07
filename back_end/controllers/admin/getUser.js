const express = require('express');
const router = express.Router();
const User = require('../../Models/User');
const authMiddleware = require('../../middleware/authMiddleware');

// Get single user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Users can only access their own profile unless admin
    if (req.user.id !== req.params.id && req.user.role.toString() !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getUser;
