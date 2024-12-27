const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const axios = require('axios');

exports.signup = async (req, res) => {
    const { name, email, password, role, location, subjects } = req.body;

    if (!name || !email || !password || !role || !location) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (role === 'tutor' && (!subjects || subjects.length === 0)) {
        return res.status(400).json({ error: 'Tutors must specify subjects' });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Convert address to GeoJSON Point
        const geoResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
        );
        if (!geoResponse.data.length) {
            return res.status(400).json({ error: 'Invalid location' });
        }

        const { lat, lon } = geoResponse.data[0]; // Extract latitude and longitude
        const geoLocation = {
            type: 'Point',
            coordinates: [parseFloat(lon), parseFloat(lat)],
        };

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            location: geoLocation, // Store as GeoJSON
            subjects: role === 'tutor' ? subjects : [],
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret', // Use fallback secret if not defined
      { expiresIn: '1d' }
    );

    // Respond with token and user info
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        subjects: user.subjects,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
