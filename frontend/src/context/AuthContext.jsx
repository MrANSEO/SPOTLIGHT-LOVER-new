import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si tokens existent au chargement
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Auto-refresh token toutes les 14 minutes (access token expire à 15min)
  useEffect(() => {
    if (isAuthenticated && refreshToken) {
      const interval = setInterval(() => {
        refreshAccessToken();
      }, 14 * 60 * 1000); // 14 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshToken]);

  // Vérifier le statut d'authentification
  const checkAuthStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Récupérer tokens depuis storage
      const storedAccessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);

        // Charger infos user
        const userData = await authService.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setIsAuthenticated(false);
      // Nettoyer tokens invalides
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email, password, rememberMe = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = response;

      // Stocker tokens
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('accessToken', newAccessToken);
      storage.setItem('refreshToken', newRefreshToken);

      // Mettre à jour état
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Erreur de connexion';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (name, email, phone, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(name, email, phone, password);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = response;

      // Auto-login après inscription (remember me = true)
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      console.error('Register error:', err);
      const errorMessage = err.response?.data?.message || "Erreur lors de l'inscription";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Nettoyer état et storage
      clearTokens();
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      setError(null);
    }
  }, []);

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) {
        throw new Error('No refresh token');
      }

      const response = await authService.refresh(storedRefreshToken);
      const { accessToken: newAccessToken } = response;

      // Mettre à jour token
      const storage = localStorage.getItem('refreshToken') ? localStorage : sessionStorage;
      storage.setItem('accessToken', newAccessToken);
      setAccessToken(newAccessToken);

      return { success: true };
    } catch (err) {
      console.error('Refresh token error:', err);
      // Token refresh échoué, déconnecter
      await logout();
      return { success: false };
    }
  };

  // Update user profile
  const updateUserProfile = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      console.error('Update profile error:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Clear tokens from storage
  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshAccessToken,
    updateUserProfile,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
