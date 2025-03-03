import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Checking token:', token); // Debug log
        
        if (token) {
          const userData = await authAPI.getProfile();
          console.log('User data from profile:', userData); // Debug log
          setUser(userData);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setError(null);
      const data = await authAPI.login(username, password);
      console.log('Login response:', data); // Debug log
      
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      setUser(data);
      return data;
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      setError(null);
      const data = await authAPI.register(username, email, password);
      console.log('Register response:', data); // Debug log
      
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      setUser(data);
      return data;
    } catch (err) {
      console.error('Register error:', err); // Debug log
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.isAdmin;
  };

    // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      return await authAPI.changePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      throw err;
    }
  };

  // Admin change user password function
  const adminChangeUserPassword = async (userId, newPassword) => {
    try {
      setError(null);
      return await authAPI.adminChangeUserPassword(userId, newPassword);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change user password');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
    changePassword,
    adminChangeUserPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};