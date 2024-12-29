const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const multer = require('multer');
const path = require('path');


const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    },
  });
  



router.post('/signup',upload.single('profilePhoto'), signup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
