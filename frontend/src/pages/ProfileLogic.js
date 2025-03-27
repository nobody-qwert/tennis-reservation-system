import { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';

export const useProfileLogic = () => {
  const { user, changePassword } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }
    
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long');
    }
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      await changePassword(currentPassword, newPassword);
      
      setMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
