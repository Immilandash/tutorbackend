const express = require('express');
const { updateProfile } = require('../controllers/profileController');

const router = express.Router();
router.put('/:id', updateProfile);

module.exports = router;
