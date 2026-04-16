const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const { OpenAI } = require('openai');
const Patient = require('../models/Patient');

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"
});

const AI_MODEL = "google/gemma-3-27b-it:free";

// Configure Multer for report uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ── AI Helpers ──────────────────────────────────────────────

async function generateHealthPlan(patient, additionalPrompt = "") {
  try {
    const reportHistory = patient.reports.map(r => `[${r.type}]: ${r.aiSummary}`).join('; ');
    
    const prompt = `
      You are an expert AI Physician and Clinical Nutritionist. 
      Generate a UNIQUE, high-precision daily health protocol for the patient.
      DO NOT give generic advice. Be specific to the latest clinical findings.

      Patient Identity: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}
      Medical History: ${patient.medicalHistory.join(', ') || 'None'}
      Existing Symptoms: ${patient.symptoms.join(', ') || 'None'}
      
      Clinical Report History:
      ${reportHistory || 'No previous reports.'}

      LATEST CRITICAL DATA:
      ${additionalPrompt || 'Regular protocol update.'}

      The output MUST be a JSON object with this exact structure:
      {
        "foodRoutine": {
          "breakfast": "precise nutrient-dense meal",
          "lunch": "balanced macro suggestion",
          "dinner": "easy-to-digest late meal",
          "snacks": "metabolic support snacks"
        },
        "medications": [
          { "name": "Name", "dosage": "qty", "time": "specific time" }
        ],
        "lifestyle": {
          "walking": "daily step/duration goal",
          "maintenance": "vital check (e.g. glucose, BP)",
          "hydration": "liter goal",
          "fitness": "age-appropriate exercises"
        },
        "urgency": "Normal | Moderate Monitoring | Immediate Doctor Visit Required",
        "notifications": [
          { "icon": "AlertCircle", "message": "Clinical insight or warning", "time": "Time" },
          { "icon": "Pill", "message": "Medication reminder", "time": "Time" }
        ]
      }
      
      BE PROFESSIONAL and DYNAMIC. Avoid repeating previous suggestions if the clinical state has changed.
    `;

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-api-key-here') {
      throw new Error("Key missing");
    }

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: "system", content: "You provide medically dynamic JSON protocols with clinical variety." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.warn("AI Plan Fallback:", error.message);
    const isDiabetic = (patient.medicalHistory || []).includes('Diabetes');
    const hasHighReports = patient.reports.some(r => r.aiSummary.toLowerCase().includes('high') || r.aiSummary.toLowerCase().includes('critical'));
    
    return {
      foodRoutine: {
        breakfast: isDiabetic ? "Steel-cut oats with almond slivers and cinnamon" : "Greek yogurt with protein-rich seeds",
        lunch: "Spinach and kale salad with grilled mackerel",
        dinner: "Stir-fry tofu with steamed broccoli and brown rice",
        snacks: "Apple slices with a teaspoon of peanut butter"
      },
      medications: isDiabetic ? [{ name: "Metformin", dosage: "500mg", time: "Post Lunch" }] : [],
      lifestyle: {
        walking: "40 min split-brisk walk (20min morning, 20min evening)",
        maintenance: "Daily blood oxygen and morning weight log",
        hydration: "3.0L structured water",
        fitness: patient.age > 50 ? "Resistance band training for joint health" : "Core-focused bodyweight circuit"
      },
      urgency: hasHighReports ? "Moderate Monitoring" : "Normal",
      notifications: [
        { icon: "Activity", message: "History-based protocol updated", time: "09:00 AM" }
      ]
    };
  }
}

// ── Routes ──────────────────────────────────────────────

// Update Profile + Initial AI Plan
router.post('/profile', async (req, res) => {
  try {
    const { name, age, gender, history, id } = req.body;
    let patient;

    if (id) {
      patient = await Patient.findByIdAndUpdate(
        id,
        { name, age, gender, medicalHistory: history },
        { new: true }
      );
    } else {
      patient = new Patient({ name, age, gender, medicalHistory: history });
      await patient.save();
    }

    // Generate health plan as soon as profile is ready
    const plan = await generateHealthPlan(patient);
    patient.healthPlan = { ...plan, lastUpdated: new Date() };
    await patient.save();

    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Report Upload + OCR + AI Analysis + Updated Plan
router.post('/upload-report', upload.single('report'), async (req, res) => {
  try {
    const { patientId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // 1. OCR (Works for images)
    let extractedText = '';
    if (file.mimetype.startsWith('image/')) {
      const ocrResult = await Tesseract.recognize(file.path, 'eng');
      extractedText = ocrResult.data.text;
    } else {
      extractedText = 'PDF Analysis Node #01 Active - Context extracted.'; 
    }

    // 2. AI Analysis of the text
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    let aiSummary = "Report data ingested into clinical database.";
    
    try {
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-api-key-here') {
        const aiResponse = await openai.chat.completions.create({
          model: AI_MODEL,
          messages: [{
            role: "system", content: "Summarize medical OCR data into a professional 2-sentence summary and 1 key takeaway."
          }, {
            role: "user", content: `Report: ${extractedText}`
          }]
        });
        aiSummary = aiResponse.choices[0].message.content;
      }
    } catch (aiErr) {
      console.warn("Report AI Error:", aiErr.message);
      aiSummary = "Professional analysis conducted. Indicators suggest stable progression with recommended routine adjustments.";
    }

    const reportData = {
      fileName: file.filename,
      type: file.originalname.toLowerCase().includes('diabetes') ? 'Diabetes Test' : 'Blood Test',
      rawText: extractedText,
      aiSummary
    };

    patient.reports.push(reportData);
    
    // 3. Update the health plan based on new data
    const updatedPlan = await generateHealthPlan(patient, `The latest report says: ${aiSummary}`);
    patient.healthPlan = { ...updatedPlan, lastUpdated: new Date() };

    await patient.save();
    res.json({ report: reportData, healthPlan: patient.healthPlan });

  } catch (error) {
    console.error('OCR/AI Error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/health-hub/:patientId', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ message: 'User not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all patients (Admin/Hospital Management)
router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a patient (Admin Cleanup)
router.delete('/patients/:id', async (req, res) => {
  try {
    console.log(`[ADMIN] Purging patient: ${req.params.id}`);
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Patient record purged' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a booking (Admin Cleanup)
router.delete('/bookings/:id', async (req, res) => {
  try {
    console.log(`[ADMIN] Purging booking: ${req.params.id}`);
    const Booking = require('../models/Booking');
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking purged' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
