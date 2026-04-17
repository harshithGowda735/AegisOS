const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const { OpenAI } = require('openai');

// Models
const Patient = require('./models/Patient');
const Booking = require('./models/Booking');
const Doctor = require('./models/Doctor');
const Hospital = require('./models/Hospital');
const Ambulance = require('./models/Ambulance');

const openai = (process.env.PROTOCOL_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY) ? new OpenAI({ 
    apiKey: process.env.PROTOCOL_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"
}) : null;

const app = express();
const PORT = process.env.PORT || 3000;
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

// ── DB Connection ──────────────────────────────────────────────
async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to MongoDB (Provided URI)');
      seedBangaloreData();
      return;
    } catch (err) {
      console.error('❌ MongoDB URI Connection Failed:', err.message);
    }
  }

  // Fallback to local
  try {
    await mongoose.connect('mongodb://localhost:27017/aegisos', { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Connected to Local MongoDB');
    seedBangaloreData();
  } catch (err) {
    console.warn('⚠️ Local MongoDB not detected. Initializing Aegis In-Memory Node...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "aegisos" });
    console.log('🚀 Aegis In-Memory Node Active (Demo Mode)');
    seedBangaloreData();
  }
}

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

// ── Haversine Distance (km) ────────────────────────────────────
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Seed Bangalore Hospital Data ───────────────────────────────
async function seedBangaloreData() {
  const count = await Hospital.countDocuments();
  if (count > 0) return; 

  const bangaloreHospitals = [
    {
      name: 'Manipal Hospital',
      address: 'Old Airport Road, Kodihalli, Bangalore',
      coordinates: { lat: 12.9600, lng: 77.6416 },
      beds: [
        { type: 'General', total: 120, available: 45 },
        { type: 'ICU', total: 20, available: 6 },
        { type: 'Emergency', total: 30, available: 12 },
      ],
      doctorsAvailable: 12, totalDoctors: 20, crowdScore: 55, rating: 4.8, capacity: 80, tags: ['Emergency', 'ICU', 'Cardiology'], isActive: true
    },
    {
      name: 'Apollo Hospitals',
      address: 'Bannerghatta Road, Bangalore',
      coordinates: { lat: 12.8959, lng: 77.5979 },
      beds: [
        { type: 'General', total: 200, available: 85 },
        { type: 'ICU', total: 35, available: 10 },
        { type: 'Emergency', total: 40, available: 18 },
      ],
      doctorsAvailable: 18, totalDoctors: 30, crowdScore: 40, rating: 4.9, capacity: 120, tags: ['Emergency', 'ICU', 'Oncology'], isActive: true
    },
    {
      name: 'Dr. Chandramma Dayananda Sagar (CDSIMER)',
      address: 'Harohalli, Kanakapura Road',
      coordinates: { lat: 12.6366, lng: 77.4116 },
      beds: [
        { type: 'General', total: 100, available: 60 },
        { type: 'ICU', total: 15, available: 5 },
        { type: 'Emergency', total: 20, available: 10 },
      ],
      doctorsAvailable: 10, totalDoctors: 20, crowdScore: 30, rating: 4.8, capacity: 80, tags: ['Emergency', 'Harohalli'], isActive: true
    },
  ];

  await Hospital.insertMany(bangaloreHospitals);
  console.log('🏥 Seeded Bangalore hospital nodes.');

  const ambulances = [
    { vehicleId: 'AG-AMB-01', vehicleType: 'Car', location: { lat: 12.9716, lng: 77.5946 }, speed: 50, status: 'Available' },
    { vehicleId: 'AG-AMB-02', vehicleType: 'Bike', location: { lat: 12.9352, lng: 77.6245 }, speed: 65, status: 'Available' },
    { vehicleId: 'AG-AMB-03', vehicleType: 'Car', location: { lat: 12.6500, lng: 77.4200 }, speed: 50, status: 'Available' },
    { vehicleId: 'AG-AMB-04', vehicleType: 'Bus', location: { lat: 12.9800, lng: 77.6100 }, speed: 35, status: 'Available' },
  ];
  await Ambulance.deleteMany({});
  await Ambulance.insertMany(ambulances);
  console.log('🚑 Seeded specialized ambulance units.');
}

// ── Simulation: Crowd Trends ─────────────────────────────────
setInterval(async () => {
    try {
      const hospitals = await Hospital.find({ isActive: true });
      for (const h of hospitals) {
        h.crowdScore = Math.max(10, Math.min(95, (h.crowdScore || 30) + (Math.random() * 6 - 3)));
        await h.save();
      }
    } catch (e) {}
}, 5000);

// ═══════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════

app.get('/', (req, res) => res.send('AegisOS Backend v2.0 Active'));

// ── Patients ──────────────────────────────────────────────────
app.post('/api/patients', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ── Hospitals ─────────────────────────────────────────────────
app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isActive: true });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/hospitals/:id', async (req, res) => {
    try {
      const hospital = await Hospital.findById(req.params.id);
      if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
      res.json(hospital);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

app.post('/api/analyze/symptoms', async (req, res) => {
  try {
    const { symptoms } = req.body;
    let severity = 'Moderate';
    const highKW  = ['chest pain', 'breath', 'bleeding', 'unconscious', 'heart', 'stroke', 'seizure'];
    const hasHigh = symptoms.some(s => highKW.some(kw => s.toLowerCase().includes(kw)));
    if (hasHigh) severity = 'High';
    res.json({ severity, recommendation: severity === 'High' ? 'Emergency' : 'Appointment' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/hospitals/decision', async (req, res) => {
  try {
    const { userLocation } = req.body;
    let hospitals = await Hospital.find({ isActive: true });
    let scored = hospitals.map(h => {
      const dist = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, h.coordinates.lat, h.coordinates.lng) : 5;
      const totalAvail = h.beds.reduce((s, b) => s + b.available, 0);
      return {
        _id: h._id,
        name: h.name,
        address: h.address,
        coordinates: h.coordinates,
        beds: h.beds,
        bedsAvailable: totalAvail,
        crowdScore: h.crowdScore || 30,
        distance: `${dist.toFixed(1)} km`,
        distanceValue: dist,
        waitTime: `${Math.round((h.crowdScore || 30) / 10 * 5)} mins`,
        rating: h.rating,
        tags: h.tags,
        doctorsAvailable: h.doctorsAvailable || 10
      };
    });
    scored.sort((a, b) => a.distanceValue - b.distanceValue);
    res.json({ hospitals: scored, bestHospital: scored[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/hospitals/book', async (req, res) => {
  try {
    const { hospitalId, hospitalName, name, patientId, severity, userLocation, amount } = req.body;
    const bookingId = `AJS-${Math.floor(Math.random() * 90000) + 10000}`;
    const booking = new Booking({
      patientId: patientId || new mongoose.Types.ObjectId(),
      hospitalId, hospitalName, patientName: name || 'Patient',
      patientLocation: userLocation || { lat: 12.9716, lng: 77.5946 },
      hospitalLocation: { lat: 12.6366, lng: 77.4116 }, 
      appointmentTime: new Date().toISOString(),
      bookingId, amount: amount || 100
    });

    const hosp = await Hospital.findById(hospitalId);
    if (hosp) booking.hospitalLocation = hosp.coordinates;
    await booking.save();

    let ambulanceAssigned = null;
    if (userLocation || severity === 'High') {
        const nearest = await Ambulance.findOne({ status: 'Available' });
        if (nearest) {
          await Ambulance.findByIdAndUpdate(nearest._id, {
            status: 'Dispatched',
            assignedBookingId: bookingId,
            assignedHospitalId: hospitalId,
            patientLocation: booking.patientLocation,
            hospitalLocation: booking.hospitalLocation,
            lastUpdated: new Date()
          });
          ambulanceAssigned = { vehicleId: nearest.vehicleId, etaMinutes: 8 };
        }
    }
    res.status(201).json({ success: true, data: booking, ambulanceAssigned });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ── Admin ─────────────────────────────────────────────────────
app.get('/api/admin/stats', async (req, res) => {
    try {
      const [totalPatients, totalBookings, revenueData] = await Promise.all([
        Patient.countDocuments(),
        Booking.countDocuments(),
        Booking.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
      ]);
      res.json({
        totalPatients, totalBookings,
        totalRevenue: revenueData[0]?.total || 0,
        occupancyRate: Math.floor(Math.random() * 40) + 50
      });
    } catch (e) { res.status(500).json({ message: e.message }); }
  });

app.get('/api/admin/bookings', async (req, res) => {
    try {
      const bookings = await Booking.find().sort({ createdAt: -1 }).limit(10);
      res.json(bookings);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/admin/doctors', async (req, res) => {
    try {
      const doctors = await Doctor.find();
      res.json(doctors);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/admin/doctors', async (req, res) => {
    try {
      const doctor = new Doctor(req.body);
      await doctor.save();
      res.status(201).json(doctor);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/admin/hospitals', async (req, res) => {
    try {
      const hospitals = await Hospital.find();
      res.json(hospitals);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/admin/hospitals/:id/beds', async (req, res) => {
    try {
      const { type, total, available } = req.body;
      const hospital = await Hospital.findById(req.params.id);
      hospital.beds.push({ type, total, available });
      await hospital.save();
      res.json(hospital);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/admin/hospitals/:id/beds/:type', async (req, res) => {
    try {
      const hospital = await Hospital.findById(req.params.id);
      hospital.beds = hospital.beds.filter(b => b.type !== req.params.type);
      await hospital.save();
      res.json(hospital);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

app.patch('/api/admin/hospitals/:id/beds', async (req, res) => {
    try {
      const { type, available } = req.body;
      const hospital = await Hospital.findById(req.params.id);
      const bed = hospital.beds.find(b => b.type === type);
      if (bed) bed.available = available;
      await hospital.save();
      res.json(hospital);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

app.patch('/api/admin/hospitals/:id/crowd', async (req, res) => {
    try {
      const { crowdCount, crowdScore } = req.body;
      const hospital = await Hospital.findByIdAndUpdate(req.params.id, { crowdCount, crowdScore }, { new: true });
      res.json(hospital);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── Ambulances ───────────────────────────────────────────────
app.get('/api/ambulances', async (req, res) => {
  try {
    const ambs = await Ambulance.find();
    res.json(ambs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/ambulance/dispatch/:bookingId', async (req, res) => {
  try {
    let amb = await Ambulance.findOne({ assignedBookingId: req.params.bookingId });
    
    if (!amb) {
        const nearest = await Ambulance.findOne({ status: 'Available' });
        if (nearest) {
          const booking = await Booking.findOne({ bookingId: req.params.bookingId });
          if (booking) {
             await Ambulance.findByIdAndUpdate(nearest._id, {
                status: 'Dispatched',
                assignedBookingId: req.params.bookingId,
                assignedHospitalId: booking.hospitalId,
                patientLocation: booking.patientLocation,
                hospitalLocation: booking.hospitalLocation,
                lastUpdated: new Date()
             });
             amb = await Ambulance.findById(nearest._id);
          }
        }
    }

    if (!amb) return res.status(404).json({ message: 'No available units' });
    
    const distToPatient = calculateDistance(amb.location.lat, amb.location.lng, amb.patientLocation.lat, amb.patientLocation.lng);
    const distToHospital = calculateDistance(amb.location.lat, amb.location.lng, amb.hospitalLocation.lat, amb.hospitalLocation.lng);
    
    res.json({
        ...amb._doc,
        distanceToPatientCoords: amb.patientLocation,
        distanceToHospitalCoords: amb.hospitalLocation,
        etaMins: Math.round((amb.status === 'Dispatched' ? distToPatient : distToHospital) / 0.5) + 1
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.patch('/api/ambulances/:vehicleId/destination', async (req, res) => {
    try {
      const { hospitalId } = req.body;
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

      const ambulance = await Ambulance.findOneAndUpdate(
        { vehicleId: req.params.vehicleId },
        { 
          assignedHospitalId: hospitalId,
          hospitalLocation: hospital.coordinates
        },
        { new: true }
      );
      
      if (!ambulance) return res.status(404).json({ message: 'Ambulance not found' });
      res.json(ambulance);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── Movement Simulation ──
setInterval(async () => {
    try {
      const active = await Ambulance.find({ status: { $in: ['Dispatched', 'Enroute'] } });
      for (const amb of active) {
        const target = amb.status === 'Dispatched' ? amb.patientLocation : amb.hospitalLocation;
        if (!target || !target.lat) continue;

        const dist = calculateDistance(amb.location.lat, amb.location.lng, target.lat, target.lng);
        if (dist < 0.1) {
            amb.status = amb.status === 'Dispatched' ? 'Enroute' : 'Arrived';
            amb.lastUpdated = new Date();
        } else {
            const step = 0.015; 
            const ratio = step / dist;
            amb.location.lat += (target.lat - amb.location.lat) * ratio;
            amb.location.lng += (target.lng - amb.location.lng) * ratio;
        }
        amb.markModified('location');
        await amb.save();
      }
    } catch (e) {}
}, 2000);

app.listen(PORT, () => console.log(`🚀 AegisOS Backend running on http://localhost:${PORT}`));
