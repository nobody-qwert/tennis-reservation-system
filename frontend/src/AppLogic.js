import { useEffect } from 'react';
import useAuthStore from './stores/useAuthStore';

// App component logic
export const useAppLogic = () => {
  const { initialize } = useAuthStore();

  // Initialize auth state on app load
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    currentYear: new Date().getFullYear()
  };
};

// Protected route logic
export const useProtectedRouteLogic = () => {
  const { user, loading } = useAuthStore();
  
  return {
    user,
    loading,
    isAuthenticated: !!user
  };
};

// Admin route logic
export const useAdminRouteLogic = () => {
  const { user, loading, isAdmin } = useAuthStore();
  
  return {
    user,
    loading,
    isAuthorized: user && isAdmin()
  };
};
