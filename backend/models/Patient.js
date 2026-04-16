const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  fileName: String,
  uploadDate: { type: Date, default: Date.now },
  type: String, // 'Diabetes', 'BloodTest', etc.
  rawText: String, // Extracted OCR text
  aiSummary: String
});

const healthPlanSchema = new mongoose.Schema({
  foodRoutine: {
    breakfast: String,
    lunch: String,
    dinner: String,
    snacks: String
  },
  medications: [{ 
    name: String, 
    dosage: String, 
    time: String,
    reminderSent: { type: Boolean, default: false }
  }],
  lifestyle: {
    walking: String,
    maintenance: String,
    hydration: String,
    fitness: String // New field for specific exercises
  },
  urgency: { type: String, default: 'Protocol Stable' }, // New field for clinical urgency
  notifications: [{
    icon: String,
    message: String,
    time: String
  }],
  lastUpdated: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  medicalHistory: [{ type: String }], // chronic diseases
  symptoms: [{ type: String }],
  severity: { type: String },
  reports: [reportSchema],
  healthPlan: healthPlanSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);
