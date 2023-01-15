const mongoose = require('mongoose');

const OTP = mongoose.model('OTP', new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
}));
module.exports = OTP;