import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservationAPI } from '../services/api';

const MyReservations = () => {
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

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Reservations</h2>
        <Link to="/book" className="btn btn-success">
          Book New Court
        </Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : reservations.length === 0 ? (
        <div className="alert alert-info">
          You don't have any reservations yet. <Link to="/book">Book a court now</Link>.
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Court</th>
                    <th>Date & Time</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>{reservation.court_name}</td>
                      <td>{formatDateTime(reservation.start_time)}</td>
                      <td>1 hour</td>
                      <td>
                        {isPastReservation(reservation.start_time) ? (
                          <span className="badge bg-secondary">Completed</span>
                        ) : (
                          <span className="badge bg-success">Upcoming</span>
                        )}
                      </td>
                      <td>
                        {!isPastReservation(reservation.start_time) && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleCancelReservation(reservation.id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;