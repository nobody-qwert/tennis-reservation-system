import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

console.log('TestNavbar module loaded');

export const useTestNavbarLogic = () => {
  console.log('TestNavbar component rendering');

  const { user, logout, isAdmin, loading } = useAuthStore();
  const navigate = useNavigate();

  console.log('TestNavbar initial props:', { user, loading, isAdmin: isAdmin?.() });

  // Track dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debug console logs
  console.log('=== TestNavbar Component State ===');
  console.log('User:', user);
  console.log('Dropdown open:', dropdownOpen);
  console.log('Dropdown ref exists:', !!dropdownRef.current);

  // Close dropdown if user clicks outside
  useEffect(() => {
    console.log('Setting up TestNavbar click outside listener');
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        console.log('Click outside detected - closing dropdown');
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      console.log('Cleaning up TestNavbar click outside listener');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown function
  const toggleDropdown = (e) => {
    console.log('TestNavbar toggle dropdown clicked');
    console.log('Current state:', dropdownOpen);
    console.log('Target:', e.target);
    setDropdownOpen(!dropdownOpen);
    console.log('New state:', !dropdownOpen);
    e.preventDefault();
  };

  const handleLogout = () => {
    console.log('TestNavbar logout clicked');
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
