import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationAPI, courtAPI, authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
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
  
  const { isAdmin, adminChangeUserPassword } = useAuth();
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

  return (
    <div className="container mt-5">
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
                            {!isPast && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleCancelReservation(reservation.id)}
                              >
                                Cancel
                              </button>
                            )}
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