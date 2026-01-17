// services/marketplaceService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a new marketplace item with image
export const createMarketplaceItem = async (itemData, imageUri) => {
  try {
    console.log('Creating marketplace item:', itemData);
    
    // Create FormData for image upload
    const formData = new FormData();
    formData.append('itemName', itemData.itemName);
    formData.append('description', itemData.description || '');
    formData.append('price', itemData.price.toString());
    formData.append('sellerName', itemData.sellerName);
    formData.append('category', itemData.category);
    
    // Add image if provided
    if (imageUri) {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('image', {
        uri: imageUri,
        name: filename || 'photo.jpg',
        type: type,
      });
    }
    
    const response = await api.post('/marketplace', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Marketplace item created:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating marketplace item:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create item',
    };
  }
};

// Get all buy items
export const getBuyItems = async () => {
  try {
    console.log('Fetching buy items...');
    const response = await api.get('/marketplace/buy');
    console.log('Buy items fetched:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching buy items:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch buy items',
    };
  }
};

// Get all sell items
export const getSellItems = async () => {
  try {
    console.log('Fetching sell items...');
    const response = await api.get('/marketplace/sell');
    console.log('Sell items fetched:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching sell items:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch sell items',
    };
  }
};

// Get user's own marketplace items
export const getUserMarketplaceItems = async () => {
  try {
    console.log('Fetching user marketplace items...');
    const response = await api.get('/marketplace/my-items');
    console.log('User items fetched:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching user items:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch user items',
    };
  }
};

// Update a marketplace item
export const updateMarketplaceItem = async (id, itemData) => {
  try {
    console.log('Updating marketplace item:', id, itemData);
    const response = await api.put(`/marketplace/${id}`, itemData);
    console.log('Item updated:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating item:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update item',
    };
  }
};

// Delete a marketplace item
export const deleteMarketplaceItem = async (id) => {
  try {
    console.log('Deleting marketplace item:', id);
    const response = await api.delete(`/marketplace/${id}`);
    console.log('Item deleted:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting item:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete item',
    };
  }
};

// Get single marketplace item by ID
export const getMarketplaceItemById = async (id) => {
  try {
    console.log('Fetching marketplace item:', id);
    const response = await api.get(`/marketplace/${id}`);
    console.log('Item fetched:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching item:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch item',
    };
  }
};

export default {
  createMarketplaceItem,
  getBuyItems,
  getSellItems,
  getUserMarketplaceItems,
  updateMarketplaceItem,
  deleteMarketplaceItem,
  getMarketplaceItemById,
};
