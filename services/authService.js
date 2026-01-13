// services/authService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Signup with email and password
export const signup = async (name, email, password) => {
  try {
    const response = await api.post('/auth/signup', {
      name,
      email,
      password,
    });
    
    if (response.data.success) {
      // Store token
      await AsyncStorage.setItem('userToken', response.data.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Signup failed' };
  }
};

// Login with email and password
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    if (response.data.success) {
      // Store token
      await AsyncStorage.setItem('userToken', response.data.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Login failed' };
  }
};

// Google authentication
export const googleAuth = async (idToken) => {
  try {
    console.log('authService.googleAuth - calling API with token');
    console.log('API endpoint:', '/auth/google');
    
    const response = await api.post('/auth/google', {
      idToken,
    });
    
    console.log('API response status:', response.status);
    console.log('API response data:', response.data);
    
    if (response.data.success) {
      // Store token
      await AsyncStorage.setItem('userToken', response.data.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
      console.log('Token stored successfully');
    }
    
    return response.data;
  } catch (error) {
    console.error('authService.googleAuth - Error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error.response?.data || { success: false, message: 'Google authentication failed' };
  }
};

// Verify token
export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Token verification failed' };
  }
};

// Logout
export const logout = async () => {
  try {
    await api.post('/auth/logout');
    // Clear local storage
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    return { success: true };
  } catch (error) {
    // Even if API fails, clear local storage
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    throw error.response?.data || { success: false, message: 'Logout failed' };
  }
};

// Get stored user data
export const getStoredUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

// Get stored token
export const getStoredToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    return null;
  }
};
