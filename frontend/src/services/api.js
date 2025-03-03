import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('Using API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API calls
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/users/login', { username, password });
    return response.data;
  },
  
  register: async (username, email, password) => {
    const response = await api.post('/users', { username, email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  }
};

// Reservations API calls
export const reservationAPI = {
  createReservation: async (courtId, startTime, endTime) => {
    const response = await api.post('/reservations', { courtId, startTime, endTime });
    return response.data;
  },
  
  getUserReservations: async () => {
    const response = await api.get('/reservations');
    return response.data;
  },
  
  getAllReservations: async () => {
    const response = await api.get('/reservations/all');
    return response.data;
  },
  
  cancelReservation: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },
  
  getAvailableCourts: async (startTime, endTime) => {
    const response = await api.get('/reservations/available', {
      params: { startTime, endTime }
    });
    return response.data;
  }
};

// Courts API calls
export const courtAPI = {
  getAllCourts: async () => {
    const response = await api.get('/courts');
    return response.data;
  },
  
  getCourtById: async (id) => {
    const response = await api.get(`/courts/${id}`);
    return response.data;
  },
  
  createCourt: async (name, surface, isIndoor) => {
    const response = await api.post('/courts', { name, surface, isIndoor });
    return response.data;
  },
  
  updateCourt: async (id, name, surface, isIndoor) => {
    const response = await api.put(`/courts/${id}`, { name, surface, isIndoor });
    return response.data;
  },
  
  deleteCourt: async (id) => {
    const response = await api.delete(`/courts/${id}`);
    return response.data;
  }
};

export default api;