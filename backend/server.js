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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const PORT = process.env.PORT || 3000;
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

// ── DB Connection ──────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aegisos';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    seedBangaloreData(); // Seed on first run
  })
  .catch(err => console.error('❌ MongoDB Error:', err));

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
  if (count > 0) return; // Already seeded

  const bangaloreHospitals = [
    {
      name: 'Manipal Hospital',
      address: 'Old Airport Road, Kodihalli, Bangalore',
      coordinates: { lat: 12.9600, lng: 77.6416 },
      beds: [
        { type: 'General', total: 120, available: 45 },
        { type: 'ICU', total: 20, available: 6 },
        { type: 'Emergency', total: 30, available: 12 },
        { type: 'Ventilator', total: 10, available: 3 },
      ],
      doctorsAvailable: 12, totalDoctors: 20, crowdScore: 55,
      rating: 4.8, capacity: 80, tags: ['Emergency', 'ICU', 'Cardiology', 'Neuro'],
    },
    {
      name: 'Apollo Hospitals',
      address: 'Bannerghatta Road, Bangalore',
      coordinates: { lat: 12.8959, lng: 77.5979 },
      beds: [
        { type: 'General', total: 200, available: 85 },
        { type: 'ICU', total: 35, available: 10 },
        { type: 'Emergency', total: 40, available: 18 },
        { type: 'Ventilator', total: 15, available: 7 },
      ],
      doctorsAvailable: 18, totalDoctors: 30, crowdScore: 40,
      rating: 4.9, capacity: 120, tags: ['Emergency', 'ICU', 'Oncology', 'Orthopedics'],
    },
    {
      name: 'Fortis Hospital',
      address: 'Cunningham Road, Bangalore',
      coordinates: { lat: 12.9866, lng: 77.5956 },
      beds: [
        { type: 'General', total: 150, available: 30 },
        { type: 'ICU', total: 25, available: 2 },
        { type: 'Emergency', total: 25, available: 5 },
        { type: 'Ventilator', total: 8, available: 0 },
      ],
      doctorsAvailable: 8, totalDoctors: 18, crowdScore: 78,
      rating: 4.6, capacity: 90, tags: ['Cardiology', 'Neuro', 'General'],
    },
    {
      name: 'Sakra World Hospital',
      address: 'Marathahalli, Bangalore',
      coordinates: { lat: 12.9247, lng: 77.6796 },
      beds: [
        { type: 'General', total: 100, available: 60 },
        { type: 'ICU', total: 18, available: 8 },
        { type: 'Emergency', total: 20, available: 14 },
        { type: 'Ventilator', total: 6, available: 4 },
      ],
      doctorsAvailable: 10, totalDoctors: 16, crowdScore: 30,
      rating: 4.7, capacity: 70, tags: ['Emergency', 'Orthopedics', 'Pediatrics'],
    },
    {
      name: 'Narayana Health City',
      address: 'Bommasandra, Bangalore',
      coordinates: { lat: 12.8105, lng: 77.6724 },
      beds: [
        { type: 'General', total: 300, available: 110 },
        { type: 'ICU', total: 50, available: 22 },
        { type: 'Emergency', total: 60, available: 35 },
        { type: 'Ventilator', total: 20, available: 10 },
      ],
      doctorsAvailable: 22, totalDoctors: 40, crowdScore: 45,
      rating: 4.9, capacity: 200, tags: ['Cardiac', 'Emergency', 'Transplant', 'ICU'],
    },
    {
      name: 'Aster CMI Hospital',
      address: 'Hebbal, Bangalore',
      coordinates: { lat: 13.0474, lng: 77.5970 },
      beds: [
        { type: 'General', total: 160, available: 70 },
        { type: 'ICU', total: 28, available: 9 },
        { type: 'Emergency', total: 35, available: 20 },
        { type: 'Ventilator', total: 12, available: 5 },
      ],
      doctorsAvailable: 14, totalDoctors: 24, crowdScore: 35,
      rating: 4.7, capacity: 100, tags: ['Emergency', 'General', 'Maternity', 'Pediatrics'],
    },
  ];

  await Hospital.insertMany(bangaloreHospitals);
  console.log('🏥 Seeded 6 Bangalore hospital nodes.');

  // Seed ambulances near Bangalore city center
  const ambulances = [
    { vehicleId: 'AG-AMB-01', location: { lat: 12.9716, lng: 77.5946 }, status: 'Available' },
    { vehicleId: 'AG-AMB-02', location: { lat: 12.9352, lng: 77.6245 }, status: 'Available' },
    { vehicleId: 'AG-AMB-03', location: { lat: 12.9500, lng: 77.5800 }, status: 'Available' },
    { vehicleId: 'AG-AMB-04', location: { lat: 12.9800, lng: 77.6100 }, status: 'Available' },
  ];
  await Ambulance.insertMany(ambulances).catch(() => {}); // Ignore duplicate key on re-run
  console.log('🚑 Seeded 4 ambulance units.');
}


// ── Background: Aegis Intelligence Nexus (Update crowd scores every 10s) ───
setInterval(async () => {
  try {
    const hospitals = await Hospital.find({ isActive: true });
    
    for (const h of hospitals) {
      // 1. Fetch Visual Data from AI Engine (OpenCV)
      let cvCount = 0;
      try {
        const res = await axios.get(`${AI_ENGINE_URL}/crowd/${h._id}`, { timeout: 1500 });
        cvCount = res.data.crowd_count || 0;
      } catch {
        cvCount = Math.floor(Math.random() * 15) + 5; // Fallback
      }

      // 2. Fetch Clinical Data
      const activeBookings = await Booking.countDocuments({ hospitalId: h._id });
      const totalAvailBeds = h.beds.reduce((s, b) => s + b.available, 0);
      const doctorsOnDuty = h.doctorsAvailable || 1;

      // 3. Aegis Intelligence Formula
      // Higher score = More crowded/stressed
      // Factors: 
      // - CV Count (Visual Load): 40%
      // - Active Bookings (Administrative Load): 30%
      // - Bed Availability (Capacity Stress): 20%
      // - Doctor Availability (Personnel Stress): 10%
      
      const visualLoad = Math.min(100, (cvCount / (h.capacity || 50)) * 100);
      const adminLoad = Math.min(100, (activeBookings / 20) * 100);
      const bedStress = Math.min(100, (1 - (totalAvailBeds / (h.capacity || 100))) * 100);
      const doctorStress = Math.min(100, (1 - (doctorsOnDuty / (h.totalDoctors || 10))) * 100);

      const compositeScore = Math.round(
        (visualLoad * 0.4) + 
        (adminLoad * 0.3) + 
        (bedStress * 0.2) + 
        (doctorStress * 0.1)
      );

      h.crowdCount = cvCount;
      h.crowdScore = compositeScore;
      h.lastUpdated = new Date();
      await h.save();
    }
  } catch (e) {
    console.error('Nexus Sync Error:', e.message);
  }
}, 3000);

// ═══════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════

app.get('/', (req, res) => res.send('AegisOS Backend v2.0 — Proximity + Crowd Intelligence Active'));

// ── Patients ──────────────────────────────────────────────────
app.post('/api/patients', async (req, res) => {
  try {
    const { age, gender, medicalHistory } = req.body;
    const patient = new Patient({ age, gender, medicalHistory });
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ── Get All Hospitals (Live from DB) ──────────────────────────
app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isActive: true });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── AI Symptom Analysis ───────────────────────────────────────
app.post('/api/analyze/symptoms', async (req, res) => {
  try {
    const { symptoms, patientId } = req.body;
    let patient = null;
    if (patientId) patient = await Patient.findById(patientId);

    let severity = 'Low';
    let recommendation = '';

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-api-key-here') {
      try {
        const patientContext = patient
          ? `Patient age: ${patient.age}, gender: ${patient.gender}, medical history: ${patient.medicalHistory.join(', ')}`
          : 'Patient profile not available';

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `You are a medical triage AI. Analyze these symptoms and respond with ONLY a JSON object:\n{"severity":"Low"|"Moderate"|"High","recommendedAction":"Appointment"|"Fast-track"|"Emergency","reasoning":"1-line explanation"}\n\nPatient: ${patientContext}\nSymptoms: ${symptoms.join(', ')}`
          }],
          response_format: { type: 'json_object' }
        });

        const result = JSON.parse(completion.choices[0].message.content);
        severity = result.severity || 'Moderate';
        recommendation = result.recommendedAction || 'Appointment';
        if (patient) { patient.symptoms = symptoms; patient.severity = severity; await patient.save(); }
        return res.json({ severity, recommendation, aiAnalyzed: true });
      } catch (aiError) {
        console.log('AI fallback:', aiError.message);
      }
    }

    // Rule-based fallback
    const highKW  = ['chest pain', 'shortness of breath', 'severe bleeding', 'unconscious', 'difficulty breathing', 'heart', 'stroke', 'seizure'];
    const modKW   = ['headache', 'fever', 'nausea', 'vomiting', 'vision', 'abdominal', 'pain', 'dizziness'];
    const hasHigh = symptoms.some(s => highKW.some(kw => s.toLowerCase().includes(kw)));
    const hasMod  = symptoms.some(s => modKW.some(kw => s.toLowerCase().includes(kw)));
    const isRisk  = patient && (patient.age > 65 || ['Heart Disease', 'Diabetes'].some(h => patient.medicalHistory.includes(h)));

    if (hasHigh || (hasMod && isRisk)) { severity = 'High';     recommendation = 'Emergency'; }
    else if (hasMod || isRisk)         { severity = 'Moderate'; recommendation = 'Fast-track'; }
    else                               { severity = 'Low';      recommendation = 'Appointment'; }

    if (patient) { patient.symptoms = symptoms; patient.severity = severity; await patient.save(); }
    res.json({ severity, recommendation, aiAnalyzed: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── Decision Engine ───────────────────────────────────────────
app.post('/api/hospitals/decision', async (req, res) => {
  try {
    const { symptoms, severity, patientId, userLocation } = req.body;

    let hospitals = await Hospital.find({ isActive: true });

    // Augment with distance and crowd-aware scoring
    let scored = hospitals.map(h => {
      const totalAvail = h.beds.reduce((s, b) => s + b.available, 0);
      const dist = userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, h.coordinates.lat, h.coordinates.lng)
        : 999;

      // Use the live crowdScore already computed by the Nexus background task
      const crowdScore = h.crowdScore || Math.min(100, Math.round((Math.random() * 15 + 10)));
      const crowdCount = h.crowdCount || Math.floor(Math.random() * 15) + 3;

      // ── Decision Intelligence ──
      // Reject if no beds or no doctors
      if (totalAvail === 0) return null;
      if (h.doctorsAvailable === 0) return null;
      // Reject if crowd is at critical capacity
      if (crowdScore >= 95) return null;

      // COMPOSITE INDEX: Proximity (50%) + OpenCV Wait (40%) + Bed Headroom (10%)
      const score = (dist * 10) * 0.5 + crowdScore * 0.4 + (100 - (totalAvail / (h.capacity || 1) * 100)) * 0.1;

      const baseWait = Math.round((crowdScore / 10) * 5 + 3);

      return {
        id: h._id.toString(),
        name: h.name,
        address: h.address,
        coordinates: h.coordinates,
        beds: h.beds,
        bedsAvailable: totalAvail,
        doctorsAvailable: h.doctorsAvailable,
        crowdCount,
        crowdScore,
        distance: dist < 999 ? `${dist.toFixed(1)} km` : 'Unknown',
        distanceValue: dist,
        waitTime: `${baseWait} mins`,
        travelTime: dist < 999 ? `${Math.round(dist * 3)} mins` : '—',
        rating: h.rating,
        tags: h.tags,
        score,
        // Status for UI colors
        status: crowdScore >= 75 ? 'Limited' : totalAvail > 20 ? 'Available' : 'Limited',
      };
    }).filter(Boolean);

    // Sort by composite score (proximity + crowd + beds)
    scored.sort((a, b) => a.score - b.score);

    res.json({
      hospitals: scored,
      bestHospital: scored[0] || null,
      crowdSource: 'ai_engine',
    });
  } catch (error) {
    console.error('Decision error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ── Book Appointment + Ambulance Dispatch ─────────────────────
app.post('/api/hospitals/book', async (req, res) => {
  try {
    const { hospitalId, hospitalName, name, time, patientId, severity, userLocation, amount } = req.body;
    const bookingId = `AJS-${Math.floor(Math.random() * 90000) + 10000}`;

    const booking = new Booking({
      patientId,
      hospitalId,
      hospitalName,
      patientName: name || 'Patient',
      appointmentTime: time || new Date().toISOString(),
      bookingId,
      amount: amount || 0,
      paymentStatus: 'Paid'
    });
    await booking.save();

    // ── Pre-fetch Hospital for GIS Telemetry ────────
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
       return res.status(404).json({ message: 'Deployment Target Not Found' });
    }

    // Decrement bed availability & Increment Revenue
    await Hospital.findByIdAndUpdate(hospitalId, {
      $inc: { 
        'beds.$[gen].available': -1,
        revenue: amount || 0
      },
    }, {
      arrayFilters: [{ 'gen.type': 'General' }],
    }).catch(() => {});

    let ambulanceAssigned = null;

    // ── Triple-Point GIS Logic ────────────────────
    if (severity === 'High' && userLocation) {
      const availableAmbulances = await Ambulance.find({ status: 'Available' });
      if (availableAmbulances.length > 0) {
        const nearest = availableAmbulances.reduce((best, amb) => {
          const d = calculateDistance(userLocation.lat, userLocation.lng, amb.location.lat, amb.location.lng);
          return d < best.dist ? { amb, dist: d } : best;
        }, { amb: availableAmbulances[0], dist: Infinity });

        await Ambulance.findByIdAndUpdate(nearest.amb._id, {
          status: 'Dispatched',
          assignedBookingId: bookingId,
          assignedHospitalId: hospitalId,
          lastUpdated: new Date(),
        });

        // Calculate GIS intersections
        const distAmbulanceToPatient = nearest.dist;
        const distAmbulanceToHospital = calculateDistance(nearest.amb.location.lat, nearest.amb.location.lng, hospital.coordinates.lat, hospital.coordinates.lng);
        const distPatientToHospital = calculateDistance(userLocation.lat, userLocation.lng, hospital.coordinates.lat, hospital.coordinates.lng);

        const etaMins = Math.round(distAmbulanceToPatient * 3 + 3);
        
        ambulanceAssigned = {
          vehicleId: nearest.amb.vehicleId,
          etaMinutes: etaMins,
          telemetry: {
             ambulanceToPatient: distAmbulanceToPatient.toFixed(1),
             ambulanceToHospital: distAmbulanceToHospital.toFixed(1),
             patientToHospital: distPatientToHospital.toFixed(1)
          }
        };
      }
    }

    // ── Update Patient Record in Registry ──────────
    if (patientId) {
      const historyStr = `[Dispatch ${bookingId}] Life-support route established to ${hospitalName}`;
      await Patient.findByIdAndUpdate(patientId, {
        severity: severity || 'Moderate',
        $push: { medicalHistory: historyStr }
      }, { returnDocument: 'after' }).catch(() => {});
    }

    res.status(201).json({
      success: true,
      data: booking,
      ambulanceAssigned,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ══════════════════════════════════════════
// ADMIN: BED MANAGEMENT APIs
// ══════════════════════════════════════════

// Get hospital with beds
app.get('/api/admin/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isActive: true });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a bed type availability
app.patch('/api/admin/hospitals/:id/beds', async (req, res) => {
  try {
    const { type, available, total } = req.body;
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    const bed = hospital.beds.find(b => b.type === type);
    if (bed) {
      if (available !== undefined) bed.available = available;
      if (total !== undefined) bed.total = total;
    }
    hospital.lastUpdated = new Date();
    await hospital.save();
    res.json(hospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a new bed type
app.post('/api/admin/hospitals/:id/beds', async (req, res) => {
  try {
    const { type, total, available } = req.body;
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    const exists = hospital.beds.find(b => b.type === type);
    if (exists) return res.status(400).json({ message: 'Bed type already exists' });

    hospital.beds.push({ type, total: total || 0, available: available || 0 });
    hospital.lastUpdated = new Date();
    await hospital.save();
    res.status(201).json(hospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a bed type
app.delete('/api/admin/hospitals/:id/beds/:type', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    hospital.beds = hospital.beds.filter(b => b.type !== req.params.type);
    hospital.lastUpdated = new Date();
    await hospital.save();
    res.json({ message: `Bed type '${req.params.type}' removed`, hospital });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update crowd score manually (for demo/YOLO simulation)
app.patch('/api/admin/hospitals/:id/crowd', async (req, res) => {
  try {
    const { crowdScore, crowdCount } = req.body;
    const hospital = await Hospital.findByIdAndUpdate(req.params.id,
      { crowdScore, crowdCount, lastUpdated: new Date() },
      { returnDocument: 'after' }
    );
    res.json(hospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ══════════════════════════════════════════
// ADMIN: DOCTORS, STATS, BOOKINGS
// ══════════════════════════════════════════

app.post('/api/admin/doctors', async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/admin/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const [totalPatients, highSeverity, totalBookings, hospitals, revenueData] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ severity: 'High' }),
      Booking.countDocuments(),
      Hospital.find({ isActive: true }),
      Booking.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
    const totalBeds = hospitals.reduce((s, h) => s + h.beds.reduce((ss, b) => ss + b.total, 0), 0);
    const availBeds = hospitals.reduce((s, h) => s + h.beds.reduce((ss, b) => ss + b.available, 0), 0);

    res.json({
      totalPatients,
      highSeverityCount: highSeverity,
      moderateSeverityCount: await Patient.countDocuments({ severity: 'Moderate' }),
      totalBookings,
      totalRevenue,
      availableBeds: availBeds,
      totalBeds,
      occupancyRate: totalBeds ? Math.round(((totalBeds - availBeds) / totalBeds) * 100) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(10);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── Ambulance status ──────────────────────────────────────────
app.get('/api/ambulances', async (req, res) => {
  try {
    const ambulances = await Ambulance.find();
    res.json(ambulances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 AegisOS Backend running on http://localhost:${PORT}`));
