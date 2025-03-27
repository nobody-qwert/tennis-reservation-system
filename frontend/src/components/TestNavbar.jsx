import { Link } from 'react-router-dom';
import { useTestNavbarLogic } from './TestNavbarLogic';

const TestNavbar = () => {
  const {
    user,
    loading,
    isAdmin,
    dropdownOpen,
    dropdownRef,
    toggleDropdown,
    handleLogout
  } = useTestNavbarLogic();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Tennis Court Reservation
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/reservations">
                    My Reservations
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/book">
                    Book Court
                  </Link>
                </li>
                {isAdmin() && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      Admin
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {loading ? (
              <li className="nav-item">
                <span className="nav-link">Loading...</span>
              </li>
            ) : user ? (
              <>
                <li className="nav-item dropdown" ref={dropdownRef}>
                  <button
                    type="button"
                    className="nav-link dropdown-toggle user-dropdown-btn"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    aria-controls="userDropdown"
                    onMouseEnter={() => console.log('=== TestNavbar Hover START: User button hovered ===')}
                    onMouseLeave={() => console.log('=== TestNavbar Hover END: User button mouse leave ===')}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('=== TestNavbar CLICK START ===');
                      console.log('Button clicked at:', new Date().toLocaleTimeString());
                      console.log('Event target:', e.target.textContent);
                      console.log('Current dropdown state:', dropdownOpen ? 'OPEN' : 'CLOSED');
                      toggleDropdown(e);
                      console.log('=== TestNavbar CLICK END ===');
                    }}
                  >
                    👤 {user.username || 'User'}
                  </button>
                  <ul
                    id="userDropdown"
                    role="menu"
                    className={`dropdown-menu dropdown-menu-end user-dropdown-menu ${dropdownOpen ? 'show' : ''}`}
                  >
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/profile"
                      >
                        <span>👤</span> My Profile
                      </Link>
                    </li>
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/change-password"
                      >
                        <span>🔑</span> Change Password
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={handleLogout}
                      >
                        <span>🚪</span> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TestNavbar;
