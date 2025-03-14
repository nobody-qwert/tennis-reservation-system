import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container mt-5 px-3">
      <div className="jumbotron bg-light p-5 rounded">
        <h1 className="display-4">Welcome to Tennis Court Reservation</h1>
        <p className="lead">
          Book your tennis court easily and manage your reservations with our platform.
        </p>
        <hr className="my-4" />
        
        {user ? (
          <div>
            <p>Ready to book a tennis court?</p>
            <Link to="/book" className="btn btn-success btn-lg me-3">
              Book a Court
            </Link>
            <Link to="/reservations" className="btn btn-outline-success btn-lg">
              View My Reservations
            </Link>
          </div>
        ) : (
          <div>
            <p>Please login or register to book tennis courts.</p>
            <Link to="/login" className="btn btn-success btn-lg me-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-success btn-lg">
              Register
            </Link>
          </div>
        )}
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Book Courts</h5>
              <p className="card-text">
                Reserve your preferred tennis court in 1-hour time slots.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Manage Reservations</h5>
              <p className="card-text">
                View and cancel your existing reservations anytime.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Court Variety</h5>
              <p className="card-text">
                Choose from various court surfaces: hard, clay, grass, and indoor courts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
