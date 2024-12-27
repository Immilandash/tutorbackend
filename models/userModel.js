const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['tutor', 'student'], required: true },
    location: {
        type: {
            type: String, // Must be 'Point'
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    subjects: { type: [String], default: [] },
});

userSchema.index({ location: '2dsphere' }); // Add geospatial index

module.exports = mongoose.model('User', userSchema);
