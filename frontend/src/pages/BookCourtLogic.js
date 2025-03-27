import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courtAPI, reservationAPI } from '../services/api';

export const useBookCourtLogic = () => {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Generate available times from 8 AM to 8 PM (12 hours)
  const generateTimeSlots = () => {
    const times = [];
    for (let i = 8; i < 20; i++) {
      times.push(`${i}:00`);
    }
    return times;
  };

  // Load all courts on component mount
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const courtsData = await courtAPI.getAllCourts();
        setCourts(courtsData);
      } catch (error) {
        setError('Failed to load courts. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourts();
  }, []);

  // Update available times when date changes
  useEffect(() => {
    if (selectedDate) {
      setAvailableTimes(generateTimeSlots());
    }
  }, [selectedDate]);

  // Check if the selected court is available at the selected time
  const checkAvailability = async () => {
    if (!selectedCourt || !selectedDate || !selectedTime) {
      return setError('Please select a court, date, and time');
    }

    try {
      setLoading(true);
      
      // Format the start and end times
      const startTime = new Date(`${selectedDate}T${selectedTime}`);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);
      
      // Format as ISO strings for the API
      const startTimeISO = startTime.toISOString();
      const endTimeISO = endTime.toISOString();
      
      // Check if the selected court is available at the selected time
      const availableCourts = await reservationAPI.getAvailableCourts(startTimeISO, endTimeISO);
      
      const isAvailable = availableCourts.some(court => court.id === parseInt(selectedCourt));
      
      if (!isAvailable) {
        setError('This court is not available at the selected time. Please choose another time or court.');
      } else {
        setError('');
      }
    } catch (error) {
      setError('Failed to check availability. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourt || !selectedDate || !selectedTime) {
      return setError('Please select a court, date, and time');
    }

    try {
      setSubmitLoading(true);
      
      // Format the start and end times
      const startTime = new Date(`${selectedDate}T${selectedTime}`);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);
      
      // Format as ISO strings for the API
      const startTimeISO = startTime.toISOString();
      const endTimeISO = endTime.toISOString();
      
      // Create the reservation
      await reservationAPI.createReservation(selectedCourt, startTimeISO, endTimeISO);
      
      // Redirect to reservations page
      navigate('/reservations');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book the court. Please try again.');
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split('T')[0];
  
  // Get max date (30 days from today) for the date input max attribute
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return {
    courts,
    selectedCourt,
    setSelectedCourt,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    availableTimes,
    error,
    loading,
    submitLoading,
    today,
    maxDateString,
    checkAvailability,
    handleSubmit
  };
};
