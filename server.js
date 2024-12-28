const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins (you can restrict it to your Flutter app's domain if needed)
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Include Authorization for JWT
  }));

// Routes
app.use('/api/auth', require('./routers/authRoutes'));
app.use('/api/profile', require('./routers/profileRoutes'));
app.use('/api/search', require('./routers/searchRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
