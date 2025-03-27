import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationAPI } from '../services/api';
import useAuthStore from '../stores/useAuthStore';

export const useAllReservationsLogic = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAdmin } = useAuthStore();
  const navigate = useNavigate();
  
  // Check if user is admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Fetch all reservations on component mount
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await reservationAPI.getAllReservations();
        
        // Sort reservations by start time (soonest first)
        const sortedReservations = data.sort((a, b) => 
          new Date(a.start_time) - new Date(b.start_time)
        );
        
        setReservations(sortedReservations);
      } catch (error) {
        setError('Failed to load reservations. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, []);

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

  return {
    reservations,
    loading,
    error,
    formatDateTime,
    handleCancelReservation
  };
};
