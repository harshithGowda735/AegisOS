const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  medicalHistory: [{ type: String }],
  symptoms: [{ type: String }],
  severity: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);
