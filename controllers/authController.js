const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const axios = require('axios'); // For HTTP requests

exports.signup = async (req, res) => {
    const { name, email, password, role, location, subjects } = req.body;

    try {
        // Validate input
        if (!name || !email || !password || !role || !location || !subjects) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Fetch coordinates from Google Geocoding API
        const geoResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: location,
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });

        if (!geoResponse.data.results.length) {
            return res.status(400).json({ error: 'Invalid location' });
        }

        const coordinates = geoResponse.data.results[0].geometry.location;
        const geoLocation = {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat], // [longitude, latitude]
        };

        // Check for duplicate email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            subjects,
            location: geoLocation,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: `Server error: ${err.message}` });
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: `Server error: ${err.message}` });
    }
};

