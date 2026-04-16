import api from './api';

export const hospitalService = {
  getHospitals: (params) => api.get('/hospitals', { params }),
  getHospitalById: (id) => api.get(`/hospitals/${id}`),
  bookAppointment: (data) => api.post('/hospitals/book', data),
  analyzeSymptoms: (data) => api.post('/analyze/symptoms', data),
  getDecision: (data) => api.post('/hospitals/decision', data),
  createPatient: (data) => api.post('/patients', data),
  getAdminStats: () => api.get('/admin/stats'),
  getRecentBookings: () => api.get('/admin/bookings'),
  getDoctors: () => api.get('/admin/doctors'),
  addDoctor: (data) => api.post('/admin/doctors', data),
};
