import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Track dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debug console logs
  console.log('=== Navbar Component State ===');
  console.log('User:', user);
  console.log('Dropdown open:', dropdownOpen);
  console.log('Dropdown ref exists:', !!dropdownRef.current);

  // Close dropdown if user clicks outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        console.log('Click outside detected - closing dropdown');
        setDropdownOpen(false);
      }
    }
    console.log('Setting up click outside listener');
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      console.log('Removing click outside listener');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown function
  const toggleDropdown = (e) => {
    console.log('Toggle dropdown clicked');
    console.log('Current state:', dropdownOpen);
    console.log('Target:', e.target);
    setDropdownOpen(!dropdownOpen);
    console.log('New state:', !dropdownOpen);
    e.preventDefault();
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success w-100">
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
                    className="nav-link dropdown-toggle"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    aria-controls="userDropdown"
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      color: 'white',
                      transition: 'all 0.2s ease-in-out',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: 0,
                      textDecoration: 'none'
                    }}
                    onMouseEnter={() => console.log('=== Hover START: User button hovered ===')}
                    onMouseLeave={() => console.log('=== Hover END: User button mouse leave ===')}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('=== CLICK START ===');
                      console.log('Button clicked at:', new Date().toLocaleTimeString());
                      console.log('Event target:', e.target.textContent);
                      console.log('Current dropdown state:', dropdownOpen ? 'OPEN' : 'CLOSED');
                      toggleDropdown(e);
                      console.log('=== CLICK END ===');
                    }}
                  >
                    👤 {user.username || 'User'}
                  </button>
                  <ul
                    id="userDropdown"
                    role="menu"
                    className="dropdown-menu dropdown-menu-end"
                    style={{ 
                      display: dropdownOpen ? 'block' : 'none',
                      position: 'absolute',
                      zIndex: 1000,
                      backgroundColor: 'white',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                      padding: '8px 0',
                      minWidth: '200px',
                      marginTop: '4px',
                      right: 0
                    }}
                  >
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/profile"
                        style={{
                          padding: '8px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#333',
                          textDecoration: 'none'
                        }}
                      >
                        <span>👤</span> My Profile
                      </Link>
                    </li>
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/profile"
                        style={{
                          padding: '8px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#333',
                          textDecoration: 'none'
                        }}
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
                        style={{
                          padding: '8px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#333',
                          width: '100%',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer'
                        }}
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

export default Navbar;
