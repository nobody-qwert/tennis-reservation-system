import { createContext, useContext } from 'react';
import { useAuthContextLogic } from './AuthContextLogic';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const {
    user,
    loading,
    error,
    initialize,
    login,
    register,
    logout,
    isAdmin,
    changePassword,
    adminChangeUserPassword
  } = useAuthContextLogic();

  const value = {
    user,
    loading,
    error,
    initialize,
    login,
    register,
    logout,
    isAdmin,
    changePassword,
    adminChangeUserPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
