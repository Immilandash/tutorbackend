// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const path = require('path');



// dotenv.config();



// connectDB();

// const app = express();
// // Middleware
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use('/api/auth', require('./routers/authRoutes'));
// app.use('/api/profile', require('./routers/profileRoutes'));
// app.use('/api/search', require('./routers/searchRoutes'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routers/authRoutes'));
app.use('/api/profile', require('./routers/profileRoutes'));
app.use('/api/search', require('./routers/searchRoutes'));

// Default Route (Optional for testing)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
