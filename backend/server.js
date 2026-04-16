const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { OpenAI } = require('openai');

const Patient = require('./models/Patient');
const Booking = require('./models/Booking');
const Doctor = require('./models/Doctor');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aegisos';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas/Local'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use(cors());
app.use(express.json());

// Mock Data Source (Hospitals stay hardcoded or move to DB later)
const hospitals = [
  { id: '1', name: 'City General Hospital', distance: '12 mins', waitTime: '15 mins', rating: 4.8, beds: 42, doctorsAvailable: 8, coordinates: { lat: 12.9716, lng: 77.5946 }, tags: ['Emergency', 'General'] },
  { id: '2', name: 'Metro Health Center', distance: '20 mins', waitTime: '5 mins', rating: 4.5, beds: 15, doctorsAvailable: 3, coordinates: { lat: 12.9352, lng: 77.6245 }, tags: ['Diabetes', 'Endocrinology'] },
  { id: '3', name: 'Westside Clinic', distance: '30 mins', waitTime: '45 mins', rating: 4.2, beds: 5, doctorsAvailable: 1, coordinates: { lat: 12.9801, lng: 77.5323 }, tags: ['Pediatrics', 'General'] }
];

// Health check
app.get('/', (req, res) => res.send('AegisOS Backend Persistent Layer Active.'));

// 🧾 New: Create Patient Profile (Onboarding)
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

// GET all hospitals
app.get('/api/hospitals', (req, res) => res.json(hospitals));

// 🧠 Advanced Analyze Symptoms (AI-Powered)
app.post('/api/analyze/symptoms', async (req, res) => {
  try {
    const { symptoms, patientId } = req.body;
    let patient = null;
    if (patientId) {
      patient = await Patient.findById(patientId);
    }

    let severity = 'Low';
    let recommendation = '';

    // Try AI analysis if API key is configured
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-api-key-here') {
      try {
        const patientContext = patient 
          ? `Patient age: ${patient.age}, gender: ${patient.gender}, medical history: ${patient.medicalHistory.join(', ')}` 
          : 'Patient profile not available';

        const prompt = `You are a medical triage AI. Analyze these symptoms and respond with ONLY a JSON object in this exact format:
{
  "severity": "Low" or "Moderate" or "High",
  "recommendedAction": "Appointment" or "Fast-track" or "Emergency",
  "reasoning": "Brief 1-line explanation"
}

Patient context: ${patientContext}
Symptoms: ${symptoms.join(', ')}`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content);
        severity = result.severity || 'Moderate';
        recommendation = result.recommendedAction || 'Appointment';
        
        // Update patient record with AI analysis
        if (patient) {
          patient.symptoms = symptoms;
          patient.severity = severity;
          await patient.save();
        }

        res.json({ severity, recommendation, aiAnalyzed: true });
        return;
      } catch (aiError) {
        console.log('AI analysis failed, falling back to rules:', aiError.message);
      }
    }

    // Fallback to rule-based analysis
    const highPriorityKeywords = ['chest pain', 'shortness of breath', 'severe bleeding', 'unconscious', 'difficulty breathing', 'heart', 'stroke'];
    const moderateKeywords = ['headache', 'fever', 'nausea', 'vomiting', 'vision', 'abdominal', 'pain'];
    
    const hasHigh = symptoms.some(s => highPriorityKeywords.some(kw => s.toLowerCase().includes(kw)));
    const hasModerate = symptoms.some(s => moderateKeywords.some(kw => s.toLowerCase().includes(kw)));
    
    const isHighRisk = patient && (patient.age > 65 || patient.medicalHistory.includes('Heart Disease') || patient.medicalHistory.includes('Diabetes'));

    if (hasHigh || (hasModerate && isHighRisk)) {
      severity = 'High';
      recommendation = 'Emergency';
    } else if (hasModerate || isHighRisk) {
      severity = 'Moderate';
      recommendation = 'Fast-track';
    } else {
      severity = 'Low';
      recommendation = 'Appointment';
    }
    
    if (patient) {
      patient.symptoms = symptoms;
      patient.severity = severity;
      await patient.save();
    }
    
    res.json({ severity, recommendation, aiAnalyzed: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🏥 Hospital Decision (Prioritizing by History)
app.post('/api/hospitals/decision', async (req, res) => {
  try {
    const { symptoms, severity, patientId } = req.body;
    let patient = null;
    if (patientId) {
      patient = await Patient.findById(patientId);
    }

    let filteredHospitals = [...hospitals];
    
    // If patient has specific history, prioritize hospitals with matching tags
    if (patient && patient.medicalHistory.length > 0) {
      filteredHospitals.sort((a, b) => {
        const aMatches = a.tags.filter(tag => patient.medicalHistory.includes(tag)).length;
        const bMatches = b.tags.filter(tag => patient.medicalHistory.includes(tag)).length;
        return bMatches - aMatches;
      });
    }

    res.json({
      hospitals: filteredHospitals,
      bestHospital: filteredHospitals[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📝 Persistent Booking
app.post('/api/hospitals/book', async (req, res) => {
  try {
    const { hospitalId, hospitalName, name, time, patientId } = req.body;
    const bookingId = `AJS-${Math.floor(Math.random() * 90000) + 10000}`;
    
    const booking = new Booking({
      patientId,
      hospitalId,
      hospitalName,
      patientName: name,
      appointmentTime: time,
      bookingId
    });
    
    await booking.save();
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 📊 Admin Stats (DB Aggregation)
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const highSeverityCount = await Patient.countDocuments({ severity: 'High' });
    const moderateSeverityCount = await Patient.countDocuments({ severity: 'Moderate' });
    const totalBookings = await Booking.countDocuments();
    
    // Revenue Calculation (Mock: 500 per booking)
    const totalRevenue = totalBookings * 500;
    
    // Simulate bed availability based on total bookings
    const totalBeds = 120;
    const occupiedBeds = totalBookings > totalBeds ? totalBeds : totalBookings;
    const availableBeds = totalBeds - occupiedBeds;

    res.json({
      totalPatients,
      highSeverityCount,
      moderateSeverityCount,
      totalBookings,
      totalRevenue,
      availableBeds,
      occupancyRate: Math.round((occupiedBeds / totalBeds) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 👨‍⚕️ Doctor Management
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

// 📜 Admin Recent Activity
app.get('/api/admin/bookings', async (req, res) => {
  try {
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('patientId');
    res.json(recentBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`AegisOS Backend running on http://localhost:${PORT}`));
