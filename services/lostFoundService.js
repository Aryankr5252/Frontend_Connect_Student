// services/lostFoundService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a new lost/found item
export const createLostFoundItem = async (itemData) => {
  try {
    console.log('Creating lost/found item:', itemData);
    const response = await api.post('/lost-found', itemData);
    console.log('Lost/Found item created:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating lost/found item:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create item',
    };
  }
};

// Get all lost items
export const getLostItems = async () => {
  try {
    console.log('Fetching lost items...');
    const response = await api.get('/lost-found/lost');
    console.log('Lost items fetched:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching lost items:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch lost items',
    };
  }
};

// Get all found items
export const getFoundItems = async () => {
  try {
    console.log('Fetching found items...');
    const response = await api.get('/lost-found/found');
    console.log('Found items fetched:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching found items:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch found items',
    };
  }
};

export default {
  createLostFoundItem,
  getLostItems,
  getFoundItems,
};
