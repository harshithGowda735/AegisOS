import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000/api';

export const ambulanceService = {
  getAllAmbulances: async () => {
    const response = await axios.get(`${API_URL}/ambulances`);
    return response.data;
  },

  getDispatchStatus: async (bookingId) => {
    const response = await axios.get(`${API_URL}/ambulance/dispatch/${bookingId}`);
    return response.data;
  },

  getHospitals: async () => {
    const response = await axios.get(`${API_URL}/hospitals`);
    return response.data;
  },

  updateDestination: async (vehicleId, hospitalId) => {
    const response = await axios.patch(`${API_URL}/ambulances/${vehicleId}/destination`, { hospitalId });
    return response.data;
  }
};
