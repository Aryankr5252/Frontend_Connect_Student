// app/marketplace/index.tsx
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getBuyItems, getSellItems } from '../../services/marketplaceService';
import '../../global.css';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 cards with padding

export default function MarketplaceScreen() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch items from API
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await getSellItems();
      
      if (response.success && response.data) {
        // Map the API response to include imageUrl
        const formattedItems = response.data.data?.map((item: any) => {
          // Convert relative image URL to absolute URL
          let imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400';
          
          // If imageUrl starts with /uploads or uploads, convert to full URL
          if (imageUrl.startsWith('/uploads') || imageUrl.startsWith('uploads')) {
            const cleanPath = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
            imageUrl = 'http://10.251.126.92:5001' + cleanPath;
          }
          
          console.log('Item:', item.itemName, 'Image URL:', imageUrl);
          
          return {
            ...item,
            id: item._id,
            imageUrl: imageUrl,
          };
        }) || [];
        setItems(formattedItems);
      } else {
        console.log('Failed to fetch items');
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load items when component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  // Reload items when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
    }, [])
  );

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  const handleItemClick = (item: any) => {
    router.push(`/marketplace/${item.id}`);
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(1)}K`;
    }
    return `₹${price}`;
  };

  // Render items in 2-column grid
  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(
        <View key={i} className="flex-row gap-3 mb-3">
          {/* First Card */}
          <TouchableOpacity
            onPress={() => handleItemClick(items[i])}
            className="bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-800"
            style={{ width: CARD_WIDTH }}
          >
            {/* Image */}
            <Image
              source={{ uri: items[i].imageUrl }}
              className="w-full h-40"
              resizeMode="cover"
            />
            
            {/* Content */}
            <View className="p-3">
              <Text className="text-white text-base font-bold mb-1" numberOfLines={1}>
                {items[i].itemName}
              </Text>
              
              <Text className="text-gray-400 text-xs mb-2" numberOfLines={2}>
                {items[i].description || 'No description'}
              </Text>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-orange-500 text-lg font-bold">
                  {formatPrice(items[i].price)}
                </Text>
                <MaterialIcons name="arrow-forward" size={18} color="#F97316" />
              </View>
              
              <View className="flex-row items-center mt-2 pt-2 border-t border-gray-800">
                <MaterialIcons name="person" size={14} color="#9CA3AF" />
                <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
                  {items[i].sellerName}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Second Card (if exists) */}
          {i + 1 < items.length && (
            <TouchableOpacity
              onPress={() => handleItemClick(items[i + 1])}
              className="bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-800"
              style={{ width: CARD_WIDTH }}
            >
              {/* Image */}
              <Image
                source={{ uri: items[i + 1].imageUrl }}
                className="w-full h-40"
                resizeMode="cover"
              />
              
              {/* Content */}
              <View className="p-3">
                <Text className="text-white text-base font-bold mb-1" numberOfLines={1}>
                  {items[i + 1].itemName}
                </Text>
                
                <Text className="text-gray-400 text-xs mb-2" numberOfLines={2}>
                  {items[i + 1].description || 'No description'}
                </Text>
                
                <View className="flex-row items-center justify-between">
                  <Text className="text-orange-500 text-lg font-bold">
                    {formatPrice(items[i + 1].price)}
                  </Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#F97316" />
                </View>
                
                <View className="flex-row items-center mt-2 pt-2 border-t border-gray-800">
                  <MaterialIcons name="person" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
                    {items[i + 1].sellerName}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-6 pt-16 pb-6 bg-gray-900">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white mb-2">Marketplace</Text>
            <Text className="text-gray-400 text-base">Buy items from students</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-3 bg-gray-800 rounded-full"
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Items Grid */}
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
            <Text className="text-gray-400 text-base mt-4">Loading items...</Text>
          </View>
        ) : items.length === 0 ? (
          <View className="items-center justify-center py-20">
            <MaterialIcons name="shopping-bag" size={64} color="#6B7280" />
            <Text className="text-gray-400 text-lg mt-4">
              No items for sale
            </Text>
            <Text className="text-gray-500 text-sm mt-2">
              Be the first to post!
            </Text>
          </View>
        ) : (
          renderGridItems()
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => router.push('/marketplace/create')}
        className="absolute bottom-8 right-6 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full items-center justify-center shadow-2xl"
        style={{
          shadowColor: '#F97316',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
