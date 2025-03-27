import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

export const useNavbarLogic = () => {
  const { user, logout, isAdmin, loading } = useAuthStore();
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

  return {
    user,
    loading,
    isAdmin,
    dropdownOpen,
    dropdownRef,
    toggleDropdown,
    handleLogout
  };
};
