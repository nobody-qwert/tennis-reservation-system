const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  changePassword,
  adminChangeUserPassword
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Register a new user
router.post('/', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/profile', protect, getUserProfile);

// Change password (for own account)
router.put('/password', protect, changePassword);

// Admin change user password
router.put('/:id/password', protect, admin, adminChangeUserPassword);

// Special route to create admin user (should be removed in production)
router.post('/setup-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await User.getUserByUsername('admin');
    
    if (adminExists) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }
    
    // Create admin user with password 'admin123'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const user = await User.createUser('admin', 'admin@tennis.com', hashedPassword, true);
    
    res.status(201).json({ 
      message: 'Admin user created successfully',
      username: 'admin',
      password: 'admin123'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;