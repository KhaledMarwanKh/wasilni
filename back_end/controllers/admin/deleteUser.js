const express = require('express');
const router = express.Router();
const User = require('../../Models/User');
const authMiddleware = require('../../middleware/authMiddleware');

const deleteUser = async (req, res) => {
  try {
    // Only admin can delete users
    if (req.user.role.toString() !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteUser;
