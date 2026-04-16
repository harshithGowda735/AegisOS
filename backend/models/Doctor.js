const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  education: { type: String, required: true },
  availability: { type: String, default: 'Available' },
  avatar: { type: String }, // Placeholder or base64
  hospitalId: { type: String }, // Link to parent hospital
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doctor', doctorSchema);
