import { useState, useEffect } from 'react';
import { reservationAPI } from '../services/api';

export const useMyReservationsLogic = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user reservations on component mount
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await reservationAPI.getUserReservations();
        
        // Sort reservations by start time (most recent first)
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

  // Check if a reservation is in the past
  const isPastReservation = (startTime) => {
    return new Date(startTime) < new Date();
  };

  // Cancel a reservation
  const handleCancelReservation = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await reservationAPI.cancelReservation(id);
        
        // Remove the cancelled reservation from the state
        setReservations(reservations.filter(res => res.id !== id));
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to cancel the reservation. Please try again.');
        console.error(error);
      }
    }
  };

  return {
    reservations,
    loading,
    error,
    formatDateTime,
    isPastReservation,
    handleCancelReservation
  };
};
