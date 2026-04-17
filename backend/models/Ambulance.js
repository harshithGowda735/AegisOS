const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  vehicleType: { 
    type: String, 
    enum: ['Bike', 'Car', 'Bus'], 
    default: 'Car' 
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  speed: { type: Number, default: 40 }, // km/h
  status: {
    type: String,
    enum: ['Available', 'Dispatched', 'Enroute', 'Arrived', 'Idle'],
    default: 'Available',
  },
  patientLocation: {
    lat: { type: Number },
    lng: { type: Number },
  },
  hospitalLocation: {
    lat: { type: Number },
    lng: { type: Number },
  },
  currentPath: [{
    lat: { type: Number },
    lng: { type: Number },
  }],
  assignedHospitalId: { type: String, default: null },
  assignedBookingId: { type: String, default: null },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
