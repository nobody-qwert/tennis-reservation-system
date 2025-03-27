import { useAdminLogic } from './AdminLogic';

const Admin = () => {
  const {
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
  } = useAdminLogic();

  return (
    <div className="container mt-5 px-3">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            All Reservations
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'courts' ? 'active' : ''}`}
            onClick={() => setActiveTab('courts')}
          >
            Manage Courts
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </li>
      </ul>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : activeTab === 'users' ? (
        <div className="card">
          <div className="card-body">
            <h3 className="mb-3">User Management</h3>
            
            {users.length === 0 ? (
              <div className="alert alert-info">No users found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.is_admin ? 'Admin' : 'User'}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleOpenPasswordModal(user)}
                          >
                            Change Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'reservations' ? (
        <div className="card">
          <div className="card-body">
            <h3 className="mb-3">All Reservations</h3>
            
            {reservations.length === 0 ? (
              <div className="alert alert-info">No reservations found.</div>
            ) : (
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
            )}
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="mb-3">Add New Court</h3>
                <form onSubmit={handleCourtSubmit}>
                  <div className="mb-3">
                    <label htmlFor="courtName" className="form-label">Court Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="courtName"
                      value={courtName}
                      onChange={(e) => setCourtName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="courtSurface" className="form-label">Surface Type</label>
                    <select
                      className="form-select"
                      id="courtSurface"
                      value={courtSurface}
                      onChange={(e) => setCourtSurface(e.target.value)}
                      required
                    >
                      <option value="">Select surface type</option>
                      <option value="Hard">Hard</option>
                      <option value="Clay">Clay</option>
                      <option value="Grass">Grass</option>
                      <option value="Carpet">Carpet</option>
                    </select>
                  </div>
                  
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isIndoor"
                      checked={isIndoor}
                      onChange={(e) => setIsIndoor(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="isIndoor">Indoor Court</label>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? 'Adding...' : 'Add Court'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="mb-3">Existing Courts</h3>
                
                {courts.length === 0 ? (
                  <div className="alert alert-info">No courts found.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Surface</th>
                          <th>Type</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courts.map((court) => (
                          <tr key={court.id}>
                            <td>{court.name}</td>
                            <td>{court.surface}</td>
                            <td>{court.is_indoor ? 'Indoor' : 'Outdoor'}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteCourt(court.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Change Password for {selectedUser?.username}</h5>
                <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {passwordSuccess && (
                  <div className="alert alert-success">{passwordSuccess}</div>
                )}
                {passwordError && (
                  <div className="alert alert-danger">{passwordError}</div>
                )}
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowPasswordModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
