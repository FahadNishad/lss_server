const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
router.post('/', async (req, res) => {
    // Log the incoming data for debugging
    console.log("Data received:", req.body);

    // Destructure the incoming request body
    const { firstName, lastName, email, userName, password, authtype } = req.body;
   
    // Check if a user with the same email already exists
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create a new user if no existing user found
        const newUser = new User({ email, password, firstName, lastName, userName, authtype });

        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error (email already exists)
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Handle other errors
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

module.exports = router;
