const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  hospitalId: { type: String, required: true },
  hospitalName: { type: String, required: true },
  patientName: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  bookingId: { type: String, required: true, unique: true },
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
