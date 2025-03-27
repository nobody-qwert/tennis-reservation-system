import { useProfileLogic } from './ProfileLogic';

const Profile = () => {
  const {
    user,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    message,
    error,
    loading,
    handleSubmit
  } = useProfileLogic();

  return (
    <div className="container mt-5 px-3">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">My Profile</h3>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h5>User Information</h5>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.isAdmin ? 'Admin' : 'User'}</p>
              </div>
              
              <hr className="my-4" />
              
              <h4 className="mb-3">Change Password</h4>
              <p className="text-muted mb-3">You can change your password using the form below. Enter your current password and then your new password twice to confirm.</p>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input 
                    type="password" 
                    id="currentPassword"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  {user?.isAdmin && (
                    <small className="text-muted">
                      Admin users can use "admin123" as the current password.
                    </small>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
