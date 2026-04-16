import { create } from 'zustand';
import { hospitalService } from '../services/hospitalService';

export const useAppStore = create((set, get) => ({
  userProfile: null,
  currentPatientId: null,
  symptoms: [],
  severity: '',
  hospitals: [],
  bestHospital: null,
  booking: null,
  adminStats: null,
  recentBookings: [],
  doctors: [],
  isLoading: false,
  error: null,

  setUserProfile: async (profile) => {
    try {
      set({ isLoading: true, error: null });
      const response = await hospitalService.createPatient(profile);
      set({ 
        userProfile: profile, 
        currentPatientId: response?.id || response?._id,
        isLoading: false 
      });
      return true;
    } catch (error) {
      console.error("Error creating patient profile:", error);
      set({ isLoading: false, error: "Failed to save profile. Proceeding as guest." });
      return true; // Still allow proceeding
    }
  },

  fetchAdminData: async () => {
    try {
      set({ isLoading: true, error: null });
      const [stats, bookings, doctors] = await Promise.all([
        hospitalService.getAdminStats(),
        hospitalService.getRecentBookings(),
        hospitalService.getDoctors()
      ]);
      set({ 
        adminStats: stats, 
        recentBookings: bookings, 
        doctors: doctors,
        isLoading: false 
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
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
      console.error("Error registering doctor:", error);
      set({ isLoading: false });
      return false;
    }
  },

  processSymptoms: async (symptomInput) => {
    try {
      set({ isLoading: true, error: null });
      const { currentPatientId } = get();
      
      const symptomsList = typeof symptomInput === 'string' 
        ? symptomInput.split(',').map(s => s.trim()).filter(Boolean)
        : symptomInput;
        
      set({ symptoms: symptomsList });

      // 1. Call analyzeSymptoms API
      const analysisData = await hospitalService.analyzeSymptoms({ 
        symptoms: symptomsList,
        patientId: currentPatientId
      });
      const severity = analysisData?.severity || 'Moderate';
      set({ severity });

      // 2. Call getDecision API
      const decisionData = await hospitalService.getDecision({ 
        symptoms: symptomsList, 
        severity,
        patientId: currentPatientId
      });
      const hospitals = decisionData?.hospitals || [];
      const bestHospital = decisionData?.bestHospital || hospitals[0] || null;

      set({ 
        severity,
        hospitals,
        bestHospital,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error("Error processing symptoms:", error);
      set({ isLoading: false });
      return true; 
    }
  },

  confirmBooking: async (bookingDetails) => {
    try {
      set({ isLoading: true, error: null });
      const { bestHospital, currentPatientId } = get();
      
      if (!bestHospital) throw new Error("No hospital selected");

      const payload = { 
        hospitalId: bestHospital.id, 
        hospitalName: bestHospital.name,
        patientId: currentPatientId,
        ...bookingDetails 
      };
      const response = await hospitalService.bookAppointment(payload);
      
      set({ booking: response.data, isLoading: false });
      return true;
    } catch (error) {
      console.error("Booking error:", error);
      set({ isLoading: false });
      return true;
    }
  },

  resetStore: () => set({
    userProfile: null,
    currentPatientId: null,
    symptoms: [],
    severity: '',
    hospitals: [],
    bestHospital: null,
    booking: null,
    error: null
  })
}));
