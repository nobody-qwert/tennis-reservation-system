import { useAllReservationsLogic } from './AllReservationsLogic';

const AllReservations = () => {
  const {
    reservations,
    loading,
    error,
    formatDateTime,
    handleCancelReservation
  } = useAllReservationsLogic();

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
