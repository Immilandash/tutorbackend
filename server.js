const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const multer = require('multer');



// Configure storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');  // Set the directory for file storage
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Create unique file names
    },
  });

  const upload = multer({ storage });


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins (you can restrict it to your Flutter app's domain if needed)
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Include Authorization for JWT
  }));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', require('./routers/authRoutes'));
app.use('/api/profile', require('./routers/profileRoutes'));
app.use('/api/search', require('./routers/searchRoutes'));
// Create a route for handling profile picture uploads
app.post('/api/upload-profile-picture', upload.single('profilePicture'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

     // Save the file path in the user's profile
  User.findByIdAndUpdate(req.user.id, { profilePicture: req.file.path }, { new: true })
  .then(user => {
    res.status(200).json({ message: 'Profile picture uploaded successfully', user });
  })
  .catch(err => {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  });
});
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
