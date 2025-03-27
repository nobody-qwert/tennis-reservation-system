import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationAPI, courtAPI, authAPI } from '../services/api';
import useAuthStore from '../stores/useAuthStore';

export const useAdminLogic = () => {
  const [activeTab, setActiveTab] = useState('reservations');
  const [reservations, setReservations] = useState([]);
  const [courts, setCourts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Court form state
  const [courtName, setCourtName] = useState('');
  const [courtSurface, setCourtSurface] = useState('');
  const [isIndoor, setIsIndoor] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const { isAdmin, adminChangeUserPassword } = useAuthStore();
  const navigate = useNavigate();
  
  // Check if user is admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Load data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (activeTab === 'reservations') {
          const data = await reservationAPI.getAllReservations();
          // Sort reservations by start time (soonest first)
          const sortedReservations = data.sort((a, b) => 
            new Date(a.start_time) - new Date(b.start_time)
          );
          setReservations(sortedReservations);
        } else if (activeTab === 'courts') {
          const data = await courtAPI.getAllCourts();
          setCourts(data);
        } else if (activeTab === 'users') {
          // Mock user data for now - in a real app you'd need to create this endpoint
          setUsers([
            { id: 1, username: 'admin', email: 'admin@tennis.com', is_admin: true },
            { id: 2, username: 'test', email: 'test@tennis.com', is_admin: false },
            { id: 3, username: 'johndoe', email: 'john@example.com', is_admin: false }
          ]);
        }
      } catch (error) {
        setError('Failed to load data. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  // Cancel a reservation
  const handleCancelReservation = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await reservationAPI.cancelReservation(id);
        // Remove the cancelled reservation from the state
        setReservations(reservations.filter(res => res.id !== id));
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to cancel the reservation.');
        console.error(error);
      }
    }
  };

  // Handle court form submission
  const handleCourtSubmit = async (e) => {
    e.preventDefault();
    
    if (!courtName || !courtSurface) {
      return setError('Please fill all required fields.');
    }
    
    try {
      setFormSubmitting(true);
      
      await courtAPI.createCourt(courtName, courtSurface, isIndoor);
      
      // Refresh the courts list
      const updatedCourts = await courtAPI.getAllCourts();
      setCourts(updatedCourts);
      
      // Reset form
      setCourtName('');
      setCourtSurface('');
      setIsIndoor(false);
      
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create court.');
      console.error(error);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Open password change modal
  const handleOpenPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
    setShowPasswordModal(true);
  };
  
  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await adminChangeUserPassword(selectedUser.id, newPassword);
      setPasswordSuccess(`Password for ${selectedUser.username} has been changed successfully`);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
      console.error(error);
    }
  };

  // Delete a court
  const handleDeleteCourt = async (id) => {
    if (window.confirm('Are you sure you want to delete this court? This will also delete all reservations for this court.')) {
      try {
        await courtAPI.deleteCourt(id);
        // Remove the deleted court from the state
        setCourts(courts.filter(court => court.id !== id));
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete the court.');
        console.error(error);
      }
    }
  };

  return {
    activeTab,
    setActiveTab,
    reservations,
    courts,
    users,
    loading,
    error,
    courtName,
    setCourtName,
    courtSurface,
    setCourtSurface,
    isIndoor,
    setIsIndoor,
    formSubmitting,
    showPasswordModal,
    setShowPasswordModal,
    selectedUser,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    passwordSuccess,
    formatDateTime,
    handleCancelReservation,
    handleCourtSubmit,
    handleOpenPasswordModal,
    handlePasswordChange,
    handleDeleteCourt
  };
};
