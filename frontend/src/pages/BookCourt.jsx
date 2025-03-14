import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courtAPI, reservationAPI } from '../services/api';

const BookCourt = () => {
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

  return (
    <div className="container mt-5 px-3">
      <h2 className="mb-4">Book a Tennis Court</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="courtSelect" className="form-label">Select Court</label>
              <select
                id="courtSelect"
                className="form-select"
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select a court</option>
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name} - {court.surface} {court.is_indoor ? '(Indoor)' : '(Outdoor)'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="dateSelect" className="form-label">Select Date</label>
              <input
                type="date"
                id="dateSelect"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
                max={maxDateString}
                required
                disabled={loading}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="timeSelect" className="form-label">Select Time</label>
              <select
                id="timeSelect"
                className="form-select"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                disabled={!selectedDate || loading}
              >
                <option value="">Select a time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedCourt && selectedDate && selectedTime && (
              <div className="d-flex">
                <button
                  type="button"
                  className="btn btn-outline-success me-2"
                  onClick={checkAvailability}
                  disabled={loading}
                >
                  Check Availability
                </button>
                
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={submitLoading || loading}
                >
                  {submitLoading ? 'Booking...' : 'Book Court'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookCourt;
