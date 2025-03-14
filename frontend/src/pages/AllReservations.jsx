import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AllReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAdmin } = useAuth();
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

  return (
    <div className="container mt-5 px-3">
      <h2 className="mb-4">All Reservations</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : reservations.length === 0 ? (
        <div className="alert alert-info">No reservations found.</div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Court</th>
                    <th>Date & Time</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => {
                    const isPast = new Date(reservation.start_time) < new Date();
                    
                    return (
                      <tr key={reservation.id}>
                        <td>{reservation.username}</td>
                        <td>{reservation.court_name}</td>
                        <td>{formatDateTime(reservation.start_time)}</td>
                        <td>1 hour</td>
                        <td>
                          {isPast ? (
                            <span className="badge bg-secondary">Completed</span>
                          ) : (
                            <span className="badge bg-success">Upcoming</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleCancelReservation(reservation.id)}
                            disabled={isPast}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReservations;
