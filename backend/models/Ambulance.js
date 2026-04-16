const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true }, // e.g., 'AG-AMB-01'
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['Available', 'Dispatched', 'On-route', 'On-site', 'Returning'],
    default: 'Available',
  },
  assignedHospitalId: { type: String, default: null },
  assignedBookingId: { type: String, default: null },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
