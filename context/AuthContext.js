// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/authService';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure Google Auth - Use Web Client ID for all platforms
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '732374183018-vmhovec9q4ae973a2jvmnug6gdv2q044.apps.googleusercontent.com',
    // For Expo Go, use the same web client ID
    expoClientId: '732374183018-vmhovec9q4ae973a2jvmnug6gdv2q044.apps.googleusercontent.com',
  });

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle Google auth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleAuth(id_token);
    }
  }, [response]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = await authService.getStoredToken();
      
      if (token) {
        // Verify token with backend
        const result = await authService.verifyToken();
        if (result.success) {
          setUser(result.data);
        } else {
          // Token invalid, clear storage
          await authService.logout();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signup(name, email, password);
      
      if (result.success) {
        setUser(result.data);
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.login(email, password);
      
      if (result.success) {
        setUser(result.data);
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (idToken) => {
    try {
      console.log('handleGoogleAuth called with token:', idToken ? 'Present' : 'Missing');
      setLoading(true);
      setError(null);
      const result = await authService.googleAuth(idToken);
      console.log('Google auth result:', result);
      
      if (result.success) {
        setUser(result.data);
        return { success: true };
      } else {
        console.error('Google auth failed:', result.message);
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Google auth error:', error);
      const errorMessage = error.message || 'Google authentication failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear user state
      setUser(null);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = () => {
    promptAsync();
  };

  const refreshUser = async () => {
    try {
      const result = await authService.verifyToken();
      if (result.success) {
        setUser(result.data);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    signup: handleSignup,
    login: handleLogin,
    logout: handleLogout,
    signInWithGoogle,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
