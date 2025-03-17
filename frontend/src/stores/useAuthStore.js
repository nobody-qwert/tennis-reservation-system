import { create } from 'zustand';
import { authAPI } from '../services/api';

// Create auth store with Zustand
const useAuthStore = create((set, get) => ({
  // State
  user: null,
  loading: true,
  error: null,

  // Actions
  initialize: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        const userData = await authAPI.getProfile();
        set({ user: userData, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.error('Authentication error:', err);
      localStorage.removeItem('token');
      set({ loading: false });
    }
  },

  login: async (username, password) => {
    try {
      set({ error: null });
      const data = await authAPI.login(username, password);
      
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      set({ user: data });
      return data;
    } catch (err) {
      console.error('Login error:', err);
      set({ error: err.response?.data?.message || 'Login failed' });
      throw err;
    }
  },

  register: async (username, email, password) => {
    try {
      set({ error: null });
      const data = await authAPI.register(username, email, password);
      
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      set({ user: data });
      return data;
    } catch (err) {
      console.error('Register error:', err);
      set({ error: err.response?.data?.message || 'Registration failed' });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },

  isAdmin: () => {
    const { user } = get();
    return user && user.isAdmin;
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      set({ error: null });
      return await authAPI.changePassword(currentPassword, newPassword);
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to change password' });
      throw err;
    }
  },

  adminChangeUserPassword: async (userId, newPassword) => {
    try {
      set({ error: null });
      return await authAPI.adminChangeUserPassword(userId, newPassword);
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to change user password' });
      throw err;
    }
  }
}));

export default useAuthStore;
