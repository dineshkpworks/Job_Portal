import { useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { register as doRegister, login as doLogin, signOut as doSignOut } from '../services/authService';

export function useAuth() {
  const { user, loading } = useAuthContext();

  const register = useCallback(async (email, password) => {
    await doRegister(email, password);
  }, []);

  const login = useCallback(async (email, password) => {
    await doLogin(email, password);
  }, []);

  const logout = useCallback(async () => {
    await doSignOut();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };
}
