const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    flightNumber: String,
    passengerName: String,
    departureDate: Date,
    seatNumber: String,
});

module.exports = mongoose.model('Booking', bookingSchema);
