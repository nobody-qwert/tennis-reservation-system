import { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';

export const useChangePasswordFormLogic = () => {
  const { changePassword, error: authError } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setSuccessMessage('Password changed successfully!');
      // Clear the form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Change password error:', err);
      // `error` from AuthContext might also be set; you can display it if you want
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    successMessage,
    error: authError,
    handleSubmit
  };
};
