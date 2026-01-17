// app/myposts/index.tsx
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserLostFoundItems, deleteLostFoundItem } from '../../services/lostFoundService';
import { getUserMarketplaceItems, deleteMarketplaceItem } from '../../services/marketplaceService';
import '../../global.css';

export default function MyPostsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'lostfound' | 'marketplace'>('lostfound');
  const [lostFoundItems, setLostFoundItems] = useState<any[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch items
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      
      // Fetch both types
      const [lostFoundRes, marketplaceRes] = await Promise.all([
        getUserLostFoundItems(),
        getUserMarketplaceItems()
      ]);

      if (lostFoundRes.success && lostFoundRes.data) {
        const formattedLF = lostFoundRes.data.data?.map((item: any) => {
          let imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400';
          if (imageUrl.startsWith('/uploads') || imageUrl.startsWith('uploads')) {
            const cleanPath = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
            imageUrl = 'http://10.251.126.92:5001' + cleanPath;
          }
          return { ...item, id: item._id, imageUrl };
        }) || [];
        setLostFoundItems(formattedLF);
      }

      if (marketplaceRes.success && marketplaceRes.data) {
        const formattedMP = marketplaceRes.data.data?.map((item: any) => {
          let imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400';
          if (imageUrl.startsWith('/uploads') || imageUrl.startsWith('uploads')) {
            const cleanPath = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
            imageUrl = 'http://10.251.126.92:5001' + cleanPath;
          }
          return { ...item, id: item._id, imageUrl };
        }) || [];
        setMarketplaceItems(formattedMP);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  // Delete handlers
  const handleDeleteLostFound = async (id: string, itemName: string) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${itemName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteLostFoundItem(id);
            if (result.success) {
              Alert.alert('Success', 'Item deleted successfully');
              fetchItems();
            } else {
              Alert.alert('Error', result.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleDeleteMarketplace = async (id: string, itemName: string) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${itemName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteMarketplaceItem(id);
            if (result.success) {
              Alert.alert('Success', 'Item deleted successfully');
              fetchItems();
            } else {
              Alert.alert('Error', result.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  // Edit handlers
  const handleEdit = (item: any, type: string) => {
    Alert.alert('Edit Item', 'Edit functionality coming soon!');
  };

  const currentItems = activeTab === 'lostfound' ? lostFoundItems : marketplaceItems;

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-6 pt-16 pb-6 bg-gray-900">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white mb-2">My Posts</Text>
            <Text className="text-gray-400 text-base">Manage your posts</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-3 bg-gray-800 rounded-full"
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tab Selector */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => setActiveTab('lostfound')}
            className={`flex-1 py-3 rounded-xl ${
              activeTab === 'lostfound' ? 'bg-orange-500' : 'bg-gray-800'
            }`}
          >
            <Text className={`text-center font-bold ${
              activeTab === 'lostfound' ? 'text-white' : 'text-gray-400'
            }`}>
              Lost & Found ({lostFoundItems.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('marketplace')}
            className={`flex-1 py-3 rounded-xl ${
              activeTab === 'marketplace' ? 'bg-orange-500' : 'bg-gray-800'
            }`}
          >
            <Text className={`text-center font-bold ${
              activeTab === 'marketplace' ? 'text-white' : 'text-gray-400'
            }`}>
              Marketplace ({marketplaceItems.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Items List */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />
        }
      >
        {isLoading && !refreshing ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#F97316" />
            <Text className="text-gray-400 text-base mt-4">Loading posts...</Text>
          </View>
        ) : currentItems.length === 0 ? (
          <View className="items-center justify-center py-20">
            <MaterialIcons name="inbox" size={64} color="#6B7280" />
            <Text className="text-gray-400 text-lg mt-4">No posts yet</Text>
            <Text className="text-gray-500 text-sm mt-2">
              Start posting to see them here
            </Text>
          </View>
        ) : (
          currentItems.map((item) => (
            <View
              key={item.id}
              className="bg-gray-900 rounded-2xl mb-4 overflow-hidden border-2 border-gray-800"
            >
              {/* Image */}
              <Image
                source={{ uri: item.imageUrl }}
                className="w-full h-48"
                resizeMode="cover"
              />
              
              {/* Content */}
              <View className="p-5">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-white text-xl font-bold mb-1">
                      {item.itemName}
                    </Text>
                    {activeTab === 'marketplace' && (
                      <Text className="text-orange-500 text-lg font-bold mt-1">
                        ₹{item.price}
                      </Text>
                    )}
                  </View>
                </View>

                <Text className="text-gray-400 text-sm mb-3" numberOfLines={2}>
                  {item.description || 'No description'}
                </Text>

                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-3 pt-3 border-t border-gray-800">
                  <TouchableOpacity
                    onPress={() => handleEdit(item, activeTab)}
                    className="flex-1 bg-blue-900/30 border border-blue-500/50 rounded-xl py-3"
                  >
                    <View className="flex-row items-center justify-center">
                      <MaterialIcons name="edit" size={20} color="#3B82F6" />
                      <Text className="text-blue-500 font-bold text-sm ml-2">Edit</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      if (activeTab === 'lostfound') {
                        handleDeleteLostFound(item.id, item.itemName);
                      } else {
                        handleDeleteMarketplace(item.id, item.itemName);
                      }
                    }}
                    className="flex-1 bg-red-900/30 border border-red-500/50 rounded-xl py-3"
                  >
                    <View className="flex-row items-center justify-center">
                      <MaterialIcons name="delete" size={20} color="#EF4444" />
                      <Text className="text-red-500 font-bold text-sm ml-2">Delete</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
