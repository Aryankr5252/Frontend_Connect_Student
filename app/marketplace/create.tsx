// app/marketplace/create.tsx
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createMarketplaceItem } from '../../services/marketplaceService';
import '../../global.css';

export default function CreateMarketplaceScreen() {
  const router = useRouter();
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    // Request permission
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images!');
        return;
      }
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!itemName || !price || !sellerName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    setIsLoading(true);

    try {
      const itemData = {
        itemName,
        description,
        price: priceNum,
        sellerName,
        category: 'sell',
      };

      console.log('Submitting marketplace item:', itemData);
      const result = await createMarketplaceItem(itemData, image);

      setIsLoading(false);

      if (result.success) {
        Alert.alert(
          'Success',
          'Item posted successfully in Marketplace!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form
                setItemName('');
                setDescription('');
                setPrice('');
                setSellerName('');
                setImage(null);
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-2 -ml-2"
            >
              <MaterialIcons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <View className="flex-1 ml-4">
              <Text className="text-3xl font-bold text-white">Post Item</Text>
              <Text className="text-gray-400 text-base mt-1">
                List your item on marketplace
              </Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View className="px-6 space-y-5">
          {/* Item Image */}
          <View className="mb-5">
            <Text className="text-white text-base font-semibold mb-3">Item Photo *</Text>
            <TouchableOpacity
              onPress={pickImage}
              className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl overflow-hidden"
            >
              {image ? (
                <View className="relative">
                  <Image
                    source={{ uri: image }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                  <View className="absolute top-3 right-3 bg-black/70 px-3 py-2 rounded-full">
                    <Text className="text-white text-xs font-semibold">Tap to change</Text>
                  </View>
                </View>
              ) : (
                <View className="p-8 items-center justify-center">
                  <MaterialIcons name="add-photo-alternate" size={64} color="#F97316" />
                  <Text className="text-white font-semibold mt-3 text-base">Add Photo</Text>
                  <Text className="text-gray-400 text-sm mt-1">Tap to select from gallery</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Item Name */}
          <View className="mb-5">
            <Text className="text-white text-base font-semibold mb-3">Item Name *</Text>
            <TextInput
              className="bg-gray-900 text-white px-6 py-4 rounded-2xl border-2 border-gray-700 text-base"
              placeholder="e.g., iPhone 13, Laptop, Books, etc."
              placeholderTextColor="#9CA3AF"
              value={itemName}
              onChangeText={setItemName}
            />
          </View>

          {/* Price */}
          <View className="mb-5">
            <Text className="text-white text-base font-semibold mb-3">Price (₹) *</Text>
            <View className="flex-row items-center bg-gray-900 rounded-2xl border-2 border-orange-500">
              <View className="px-4">
                <Text className="text-orange-500 text-xl font-bold">₹</Text>
              </View>
              <TextInput
                className="flex-1 text-white py-4 pr-6 text-base"
                placeholder="Enter price"
                placeholderTextColor="#9CA3AF"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Description */}
          <View className="mb-5">
            <Text className="text-white text-base font-semibold mb-3">Description</Text>
            <TextInput
              className="bg-gray-900 text-white px-6 py-4 rounded-2xl border-2 border-gray-700 text-base"
              placeholder="Describe your item (condition, features, etc.)"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 120 }}
            />
          </View>

          {/* Seller/Contact Name */}
          <View className="mb-5">
            <Text className="text-white text-base font-semibold mb-3">Your Name/Contact *</Text>
            <TextInput
              className="bg-gray-900 text-white px-6 py-4 rounded-2xl border-2 border-gray-700 text-base"
              placeholder="How should buyers contact you?"
              placeholderTextColor="#9CA3AF"
              value={sellerName}
              onChangeText={setSellerName}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className={`py-5 rounded-2xl mb-6 ${
              isLoading ? 'bg-gray-700' : 'bg-gradient-to-r from-orange-500 to-orange-600'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Post Item
              </Text>
            )}
          </TouchableOpacity>

          {/* Info Card */}
          <View className="bg-gray-900 p-5 rounded-2xl border-2 border-gray-800 mb-6">
            <View className="flex-row items-start">
              <MaterialIcons name="info" size={24} color="#F97316" />
              <View className="flex-1 ml-3">
                <Text className="text-white font-semibold mb-2">Posting Guidelines</Text>
                <Text className="text-gray-400 text-sm leading-5">
                  • Be honest about item condition{'\n'}
                  • Set fair prices{'\n'}
                  • Provide clear contact information{'\n'}
                  • Upload clear photos of the item
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
