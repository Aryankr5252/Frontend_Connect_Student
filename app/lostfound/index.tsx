// app/lostfound/index.tsx
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getLostItems, getFoundItems } from '../../services/lostFoundService';
import '../../global.css';

// Mock data with images (fallback)
const mockLostItems = [
  {
    id: 1,
    itemName: 'Black Wallet',
    description: 'Black leather wallet with cards inside. Lost near library entrance.',
    location: 'Library',
    lostDate: '2026-01-10',
    contactNumber: '9876543210',
    type: 'lost',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
  },
  {
    id: 2,
    itemName: 'iPhone 13 Pro',
    description: 'Blue iPhone 13 Pro with a cracked screen protector. Lost in cafeteria.',
    location: 'Cafeteria',
    lostDate: '2026-01-09',
    contactNumber: '9876543211',
    type: 'lost',
    image: 'https://images.unsplash.com/photo-1592286927505-2fd25a556c7f?w=400',
  },
  {
    id: 3,
    itemName: 'Red Water Bottle',
    description: 'Stainless steel red water bottle with stickers. Found in parking lot.',
    location: 'Parking Lot',
    lostDate: '2026-01-11',
    contactNumber: '9876543212',
    type: 'found',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
  },
  {
    id: 4,
    itemName: 'Laptop Charger',
    description: 'MacBook Pro charger with frayed cable. Found in computer lab.',
    location: 'Computer Lab',
    lostDate: '2026-01-08',
    contactNumber: '9876543213',
    type: 'found',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  },
  {
    id: 5,
    itemName: 'Blue Backpack',
    description: 'Navy blue backpack with laptop compartment. Lost near gate 2.',
    location: 'Main Gate',
    lostDate: '2026-01-12',
    contactNumber: '9876543214',
    type: 'lost',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
  },
  {
    id: 6,
    itemName: 'Car Keys',
    description: 'Toyota car keys with red keychain. Found in sports ground.',
    location: 'Sports Ground',
    lostDate: '2026-01-11',
    contactNumber: '9876543215',
    type: 'found',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400',
  },
];

export default function LostFoundScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch items from API
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = activeTab === 'lost' 
        ? await getLostItems() 
        : await getFoundItems();
      
      if (response.success && response.data) {
        // Map the API response to include imageUrl
        const formattedItems = response.data.data?.map((item: any) => {
          // Convert relative image URL to absolute URL
          let imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400';
          
          // If imageUrl starts with /uploads, convert to full URL
          if (imageUrl.startsWith('/uploads')) {
            imageUrl = 'http://10.251.126.92:5001' + imageUrl;
          }
          
          return {
            ...item,
            id: item._id,
            image: imageUrl,
          };
        }) || [];
        setItems(formattedItems);
      } else {
        console.log('Failed to fetch items, using mock data');
        setItems(mockLostItems.filter(item => item.type === activeTab));
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems(mockLostItems.filter(item => item.type === activeTab));
    } finally {
      setIsLoading(false);
    }
  };

  // Load items when component mounts or tab changes
  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  // Reload items when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
    }, [activeTab])
  );

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  const filteredItems = items;

  const handleItemClick = (item: any) => {
    router.push(`/lostfound/${item._id || item.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-6 pt-16 pb-6 bg-gray-900">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white mb-2">Lost & Found</Text>
            <Text className="text-gray-400 text-base">Find your lost items</Text>
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
            onPress={() => setActiveTab('lost')}
            className={`flex-1 py-3 rounded-xl ${
              activeTab === 'lost' 
                ? 'bg-orange-500' 
                : 'bg-gray-800'
            }`}
          >
            <Text className={`text-center font-bold ${
              activeTab === 'lost' ? 'text-white' : 'text-gray-400'
            }`}>
              Lost Items ({items.filter(i => i.type === 'lost').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('found')}
            className={`flex-1 py-3 rounded-xl ${
              activeTab === 'found' 
                ? 'bg-orange-500' 
                : 'bg-gray-800'
            }`}
          >
            <Text className={`text-center font-bold ${
              activeTab === 'found' ? 'text-white' : 'text-gray-400'
            }`}>
              Found Items ({items.filter(i => i.type === 'found').length})
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
            <Text className="text-gray-400 text-base mt-4">Loading items...</Text>
          </View>
        ) : (
          <>
            {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleItemClick(item)}
            className="bg-gray-900 rounded-2xl mb-4 overflow-hidden border-2 border-gray-800"
          >
            {/* Image */}
            <Image
              source={{ uri: item.image }}
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
                  <View className="flex-row items-center mt-1">
                    <MaterialIcons name="place" size={16} color="#F97316" />
                    <Text className="text-orange-500 text-sm ml-1">
                      {item.location}
                    </Text>
                  </View>
                </View>
                <View className={`px-3 py-1 rounded-full ${
                  item.type === 'lost' ? 'bg-red-900' : 'bg-green-900'
                }`}>
                  <Text className={`text-xs font-bold ${
                    item.type === 'lost' ? 'text-red-300' : 'text-green-300'
                  }`}>
                    {item.type.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-400 text-sm mb-3" numberOfLines={2}>
                {item.description}
              </Text>

              <View className="flex-row items-center justify-between pt-3 border-t border-gray-800">
                <View className="flex-row items-center">
                  <MaterialIcons name="access-time" size={16} color="#9CA3AF" />
                  <Text className="text-gray-500 text-sm ml-1">
                    {formatDate(item.lostDate)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialIcons name="phone" size={16} color="#F97316" />
                  <Text className="text-orange-500 text-sm ml-1 font-semibold">
                    Contact
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredItems.length === 0 && !isLoading && (
          <View className="items-center justify-center py-20">
            <MaterialIcons name="search-off" size={64} color="#6B7280" />
            <Text className="text-gray-400 text-lg mt-4">
              No {activeTab} items found
            </Text>
          </View>
        )}
          </>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => router.push('/lostfound/create')}
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
