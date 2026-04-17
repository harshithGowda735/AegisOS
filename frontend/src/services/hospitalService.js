import api from './api';
import axios from 'axios';

export const hospitalService = {
  // Hospitals
  getHospitals: (params) => api.get('/hospitals', { params }),
  getHospitalById: (id) => api.get(`/hospitals/${id}`),
  analyzeSymptoms: (data) => api.post('/analyze/symptoms', data),
  getDecision: (data) => api.post('/hospitals/decision', data),
  bookAppointment: (data) => api.post('/hospitals/book', data),
  createPatient: (data) => api.post('/patients', data),

  // Admin
  getAdminStats: () => api.get('/admin/stats'),
  getRecentBookings: () => api.get('/admin/bookings'),
  getDoctors: () => api.get('/admin/doctors'),
  addDoctor: (data) => api.post('/admin/doctors', data),
  getAdminHospitals: () => api.get('/admin/hospitals'),

  // Bed management
  updateBeds: (hospitalId, data) => api.patch(`/admin/hospitals/${hospitalId}/beds`, data),
  addBedType: (hospitalId, data) => api.post(`/admin/hospitals/${hospitalId}/beds`, data),
  removeBedType: (hospitalId, type) => api.delete(`/admin/hospitals/${hospitalId}/beds/${type}`),

  // User Health Platform
  updateUserProfile: (profile) => api.post('/user/profile', profile),
  uploadReport: (patientId, file) => {
    const formData = new FormData();
    formData.append('report', file);
    formData.append('patientId', patientId);
    return api.post('/user/upload-report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  analyzePrescription: (condition, file) => {
    const formData = new FormData();
    formData.append('prescription', file);
    formData.append('condition', condition);
    return api.post('/user/analyze-prescription', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getHealthHubData: (patientId) => api.get(`/user/health-hub/${patientId}`),
  recalculateProtocol: (patientId) => api.post(`/user/health-hub/${patientId}/recalculate`),
  getAllPatients: () => api.get('/user/patients'),
  deletePatient: (id) => api.delete(`/user/patients/${id}`),
  deleteBooking: (id) => api.delete(`/user/bookings/${id}`),

  // AI Engine (IoT Nodes) - Port 8000 (FastAPI)
  getCrowdData: (hospitalId) => {
    if (!hospitalId) return Promise.reject("Invalid ID");
    return axios.get(`http://127.0.0.1:8000/crowd/${hospitalId}`);
  },
  syncFrameMetadata: async (hospitalId, count) => {
    if (!hospitalId) return;
    // 1. Sync with FastAPI AI Engine (Crowd Intel)
    await axios.post(`http://127.0.0.1:8000/analyze-frame/${hospitalId}`, { count }).catch(() => {});
    // 2. Sync with Main Node.js Backend (Dashboard State)
    return api.patch(`/admin/hospitals/${hospitalId}/crowd`, { crowdCount: count, crowdScore: Math.min(100, Math.round(count * 2.5)) });
  },

  // Ambulances
  getAmbulances: () => api.get('/ambulances'),
};
