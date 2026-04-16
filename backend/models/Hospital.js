const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'ICU', 'General', 'Ventilator', 'Emergency'
  total: { type: Number, default: 0 },
  available: { type: Number, default: 0 },
});

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  beds: [bedSchema],
  doctorsAvailable: { type: Number, default: 0 },
  totalDoctors: { type: Number, default: 0 },
  // crowdScore: 0-100, simulates OpenCV/YOLO waiting room occupancy
  crowdScore: { type: Number, default: 0, min: 0, max: 100 },
  // crowd_count: raw people count from AI engine
  crowdCount: { type: Number, default: 0 },
  capacity: { type: Number, default: 50 }, // max simultaneous visitors
  rating: { type: Number, default: 4.0 },
  tags: [{ type: String }], // e.g., ['Emergency', 'ICU', 'Cardiology']
  isActive: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

// Virtual: total available beds across all types
hospitalSchema.virtual('totalBedsAvailable').get(function () {
  return this.beds.reduce((sum, b) => sum + b.available, 0);
});

// Virtual: waitTime string based on crowd + beds
hospitalSchema.virtual('waitTime').get(function () {
  const totalAvail = this.beds.reduce((sum, b) => sum + b.available, 0);
  if (totalAvail === 0) return 'Unavailable';
  const baseWait = Math.round((this.crowdScore / 10) * 5 + 5); // 5–55 mins
  return `${baseWait} mins`;
});

hospitalSchema.set('toJSON', { virtuals: true });
hospitalSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
