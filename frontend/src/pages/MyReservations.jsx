import { Link } from 'react-router-dom';
import { useMyReservationsLogic } from './MyReservationsLogic';

const MyReservations = () => {
  const {
    reservations,
    loading,
    error,
    formatDateTime,
    isPastReservation,
    handleCancelReservation
  } = useMyReservationsLogic();

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
