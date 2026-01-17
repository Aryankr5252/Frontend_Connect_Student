// app/lostfound/[id].tsx
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getLostFoundItemById } from '../../services/lostFoundService';
import { useAuth } from '../../context/AuthContext';
import '../../global.css';

export default function LostFoundDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchItemDetails();
    }
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getLostFoundItemById(id as string);
      
      if (response.success && response.data) {
        const itemData = response.data.data;
        
        // Convert relative image URL to absolute URL
        let imageUrl = itemData.imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400';
        if (imageUrl.startsWith('/uploads') || imageUrl.startsWith('uploads')) {
          const cleanPath = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
          imageUrl = 'http://10.251.126.92:5001' + cleanPath;
        }
        
        setItem({
          ...itemData,
          imageUrl,
        });
      } else {
        Alert.alert('Error', 'Failed to load item details');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      Alert.alert('Error', 'Failed to load item details');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactOwner = () => {
    if (!item?.createdBy) {
      Alert.alert('Error', 'Owner information not available');
      return;
    }
    
    Alert.alert(
      'Contact Person',
      `Name: ${item.createdBy.name}\nEmail: ${item.createdBy.email}\nPhone: ${item.contactNumber}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            if (item.contactNumber) {
              Linking.openURL(`tel:${item.contactNumber}`);
            }
          }
        },
        {
          text: 'Send Email',
          onPress: () => {
            Linking.openURL(`mailto:${item.createdBy.email}?subject=Regarding ${item.itemName}`);
          }
        }
      ]
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="text-gray-400 mt-4">Loading...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">Item not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-orange-500 px-6 py-3 rounded-xl">
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwner = user?._id === item.createdBy?._id;
  const statusColor = item.type === 'lost' ? '#EF4444' : '#10B981';
  const statusBg = item.type === 'lost' ? '#7F1D1D' : '#064E3B';

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-6 pt-16 pb-4 bg-gray-900 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-800 rounded-full">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Item Details</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Item Image */}
        <View className="relative">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-80"
            resizeMode="cover"
          />
          <View 
            className="absolute top-4 right-4 px-4 py-2 rounded-full"
            style={{ backgroundColor: statusBg }}
          >
            <Text className="font-bold text-base uppercase" style={{ color: statusColor }}>
              {item.type}
            </Text>
          </View>
        </View>

        {/* Item Details */}
        <View className="px-6 py-6">
          {/* Item Name */}
          <Text className="text-white text-3xl font-bold mb-4">{item.itemName}</Text>

          {/* Posted By */}
          <View className="bg-gray-900 rounded-2xl p-4 mb-6 flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-orange-500 items-center justify-center mr-4">
              <Text className="text-white text-xl font-bold">
                {item.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 text-sm">Posted By</Text>
              <Text className="text-white text-lg font-semibold">{item.createdBy?.name}</Text>
            </View>
            {isOwner && (
              <View className="bg-orange-500/20 px-3 py-1 rounded-full">
                <Text className="text-orange-500 text-xs font-bold">Your Post</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-white text-lg font-bold mb-2">Description</Text>
            <View className="bg-gray-900 rounded-2xl p-4">
              <Text className="text-gray-300 text-base leading-6">{item.description}</Text>
            </View>
          </View>

          {/* Date and Location */}
          <View className="bg-gray-900 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="event" size={20} color="#F97316" />
              <Text className="text-gray-400 ml-3 flex-1">{item.type === 'lost' ? 'Lost On' : 'Found On'}</Text>
              <Text className="text-white font-semibold">{formatDate(item.lostDate)}</Text>
            </View>
            {item.location && (
              <>
                <View className="h-px bg-gray-800 my-2" />
                <View className="flex-row items-center">
                  <MaterialIcons name="location-on" size={20} color="#F97316" />
                  <Text className="text-gray-400 ml-3 flex-1">Location</Text>
                  <Text className="text-white font-semibold">{item.location}</Text>
                </View>
              </>
            )}
          </View>

          {/* Contact Info */}
          <View className="bg-gray-900 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center">
              <MaterialIcons name="phone" size={20} color="#10B981" />
              <Text className="text-gray-400 ml-3 flex-1">Contact Number</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contactNumber}`)}>
                <Text className="text-orange-500 font-bold text-lg">{item.contactNumber}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Posted Date */}
          <View className="bg-gray-900 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center">
              <MaterialIcons name="schedule" size={20} color="#F97316" />
              <Text className="text-gray-400 ml-3 flex-1">Posted On</Text>
              <Text className="text-white font-semibold">{formatDate(item.createdAt)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      {!isOwner && (
        <View className="px-6 pb-8 pt-4 bg-gray-900 border-t border-gray-800">
          <TouchableOpacity
            onPress={handleContactOwner}
            className="bg-orange-500 rounded-2xl py-5 flex-row items-center justify-center"
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-3">Contact Owner</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
