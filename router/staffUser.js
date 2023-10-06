const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// Route to get user profile with staff profile populated
router.get('/profile/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;

    // Find the user by email and populate the staffProfile field
    const user = await User.findOne({ email: userEmail }).populate('staffProfile');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
