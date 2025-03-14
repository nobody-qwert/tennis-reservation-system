import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookCourt from './pages/BookCourt';
import MyReservations from './pages/MyReservations';
import Admin from './pages/Admin';
import AllReservations from './pages/AllReservations';
import Profile from './pages/Profile';
import ChangePasswordForm from './pages/ChangePasswordForm';
import { useAuth } from './contexts/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  
  if (!user || !isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <div>
          <Navbar />
        </div>
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/book" 
              element={
                <ProtectedRoute>
                  <BookCourt />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reservations" 
              element={
                <ProtectedRoute>
                  <MyReservations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/change-password" 
              element={
                <ProtectedRoute>
                  <ChangePasswordForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } 
            />
            <Route 
              path="/all-reservations" 
              element={
                <AdminRoute>
                  <AllReservations />
                </AdminRoute>
              } 
            />
          </Routes>
        </main>
        <footer className="bg-light py-3 text-center mt-auto">
          <div className="container">
            <p className="mb-0">Tennis Court Reservation System© {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
