const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['tutor', 'student'], required: true },
    subjects: { type: [String], required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'], // GeoJSON format
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
});

userSchema.index({ location: '2dsphere' }); // Index for geospatial queries

const User = mongoose.model('User', userSchema);

module.exports = User;
