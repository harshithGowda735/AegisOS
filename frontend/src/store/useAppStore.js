import { create } from 'zustand';
import { hospitalService } from '../services/hospitalService';

export const useAppStore = create((set, get) => ({
  // ── Profile & Patient ───────────────────────
  userProfile: null,
  currentPatientId: null,
  
  // ── Symptoms & Triage ───────────────────────
  symptoms: [],
  severity: '',
  triageData: null,

  // ── Hospitals ───────────────────────────────
  hospitals: [],
  bestHospital: null,

  // ── Booking ─────────────────────────────────
  booking: null,
  isAutonomouslyBooked: false,
  ambulanceDispatched: null,

  // ── Admin ────────────────────────────────────
  adminStats: null,
  recentBookings: [],
  doctors: [],
  adminHospitals: [],
  allPatients: [],

  // ── Global State ─────────────────────────────
  userLocation: null,
  isLoading: false,
  error: null,

  // ══════════════════════════════════════════════
  // ACTIONS
  // ══════════════════════════════════════════════

  initializeLocation: () => {
    try {
      const savedId = localStorage.getItem('aegis_patient_id');
      if (savedId) set({ currentPatientId: savedId });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => set({ userLocation: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
          () => set({ userLocation: { lat: 12.9716, lng: 77.5946 } })
        );
      } else {
        set({ userLocation: { lat: 12.9716, lng: 77.5946 } });
      }
    } catch (e) {
      console.warn("Location initialization failed", e);
    }
  },

  setUserProfile: async (profile) => {
    try {
      set({ isLoading: true, error: null });
      const response = await hospitalService.updateUserProfile(profile);
      const patientId = response?.id || response?._id;
      if (patientId) localStorage.setItem('aegis_patient_id', patientId);
      set({ userProfile: response, currentPatientId: patientId, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false, error: 'Registration failed' });
      return false;
    }
  },

  processSymptoms: async (symptomInput) => {
    try {
      set({ isLoading: true, error: null, isAutonomouslyBooked: false, ambulanceDispatched: null });
      const { currentPatientId, userLocation } = get();
      
      const symptomsList = typeof symptomInput === 'string'
        ? symptomInput.split(',').map(s => s.trim()).filter(Boolean)
        : symptomInput;

      const [analysisData, decisionData] = await Promise.all([
        hospitalService.analyzeSymptoms({ symptoms: symptomsList, patientId: currentPatientId }),
        hospitalService.getDecision({ symptoms: symptomsList, patientId: currentPatientId, userLocation })
      ]);

      const severity = analysisData?.severity || 'Moderate';
      const recommendation = analysisData?.recommendation || 'Appointment';
      const hospitals = decisionData?.hospitals || [];
      const bestHospital = decisionData?.bestHospital || hospitals[0] || null;

      set({
        severity,
        triageData: {
          severity,
          recommendation,
          summary: `${severity} severity detected. ${recommendation} recommended.`,
          recommendations: [
            recommendation === 'Emergency' ? 'Immediate emergency care required.' : 'Schedule consultation.',
            'Nearest facility with available beds identified.',
            'AI-verified specialist routing active.',
          ],
        },
        hospitals,
        bestHospital,
        isLoading: false,
        isAutonomouslyBooked: severity === 'High',
      });
      return true;
    } catch (error) {
      console.error('Triage Error:', error);
      set({ isLoading: false, error: 'Triage analysis failed' });
      return true; // Return true to allow navigation to fallback state
    }
  },

  confirmBooking: async (bookingDetails) => {
    try {
      set({ isLoading: true, error: null });
      const { bestHospital, currentPatientId, userLocation, severity, userProfile } = get();
      if (!bestHospital) return false;

      const payload = {
        hospitalId: bestHospital.id || bestHospital._id,
        hospitalName: bestHospital.name,
        patientId: currentPatientId,
        name: userProfile?.name || 'Patient',
        severity: bookingDetails.severity || severity,
        userLocation,
        ...bookingDetails,
      };

      const response = await hospitalService.bookAppointment(payload);
      
      // Refresh admin data immediately so dashboard shows the new patient/booking
      await get().fetchAdminData();

      set({
        booking: response.data,
        ambulanceDispatched: response.ambulanceAssigned || null,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  fetchAdminData: async () => {
    try {
      set({ isLoading: true });
      // Use fallback if a service fails to prevent total dashboard crash
      const [statsRes, bookingsRes, doctorsRes, hospitalsRes, patientsRes] = await Promise.allSettled([
        hospitalService.getAdminStats(),
        hospitalService.getRecentBookings(),
        hospitalService.getDoctors(),
        hospitalService.getAdminHospitals(),
        hospitalService.getAllPatients()
      ]);

      const stats = statsRes.status === 'fulfilled' ? statsRes.value : null;
      const bookings = bookingsRes.status === 'fulfilled' ? bookingsRes.value : [];
      const doctors = doctorsRes.status === 'fulfilled' ? doctorsRes.value : [];
      const adminHospitals = hospitalsRes.status === 'fulfilled' ? hospitalsRes.value : [];
      const allPatients = patientsRes.status === 'fulfilled' ? patientsRes.value : [];

      set({ 
        adminStats: stats, 
        recentBookings: bookings, 
        doctors, 
        adminHospitals, 
        allPatients,
        isLoading: false 
      });
    } catch (error) {
      console.error('Admin Fetch Crash:', error);
      set({ isLoading: false });
    }
  },

  registerDoctor: async (doctorData) => {
    try {
      set({ isLoading: true });
      await hospitalService.addDoctor(doctorData);
      const doctors = await hospitalService.getDoctors();
      set({ doctors, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  updateBeds: async (hospitalId, bedType, available, total) => {
    try {
      await hospitalService.updateBeds(hospitalId, { type: bedType, available, total });
      const adminHospitals = await hospitalService.getAdminHospitals();
      set({ adminHospitals });
      return true;
    } catch (error) {
      return false;
    }
  },

  addBedType: async (hospitalId, bedData) => {
    try {
      await hospitalService.addBedType(hospitalId, bedData);
      const adminHospitals = await hospitalService.getAdminHospitals();
      set({ adminHospitals });
      return true;
    } catch (error) {
      return false;
    }
  },

  removeBedType: async (hospitalId, bedType) => {
    try {
      await hospitalService.removeBedType(hospitalId, bedType);
      const adminHospitals = await hospitalService.getAdminHospitals();
      set({ adminHospitals });
      return true;
    } catch (error) {
      return false;
    }
  },

  deletePatient: async (id) => {
    try {
      set({ isLoading: true });
      console.log(`[STORE] Purging patient: ${id}`);
      await hospitalService.deletePatient(id);
      await get().fetchAdminData();
      return true;
    } catch (error) {
       console.error("Purge Error:", error);
       set({ isLoading: false });
       return false;
    }
  },

  deleteBooking: async (id) => {
    try {
      set({ isLoading: true });
      console.log(`[STORE] Purging booking: ${id}`);
      await hospitalService.deleteBooking(id);
      await get().fetchAdminData();
      return true;
    } catch (error) {
       console.error("Booking Purge Error:", error);
       set({ isLoading: false });
       return false;
    }
  },

  resetStore: () => set({
    symptoms: [], severity: '', triageData: null,
    hospitals: [], bestHospital: null,
    booking: null, isAutonomouslyBooked: false, ambulanceDispatched: null,
    error: null,
  }),
}));
