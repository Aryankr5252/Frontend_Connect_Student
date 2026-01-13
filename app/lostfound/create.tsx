// app/lostfound/create.tsx
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createLostFoundItem } from '../../services/lostFoundService';
import '../../global.css';

export default function CreateLostFoundScreen() {
  const router = useRouter();
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [lostDate, setLostDate] = useState('');
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
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!itemName || !description || !contactNumber || !lostDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (contactNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid contact number');
      return;
    }

    setIsLoading(true);

    try {
      // Convert date format if needed (DD/MM/YYYY to ISO)
      const dateParts = lostDate.split('/');
      let dateISO = lostDate;
      
      if (dateParts.length === 3) {
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = dateParts;
        dateISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      const itemData = {
        itemName,
        description,
        lostDate: dateISO,
        location: location || 'Not specified',
        contactNumber,
        type,
      };

      console.log('Submitting lost/found item:', itemData);
      const result = await createLostFoundItem(itemData);

      setIsLoading(false);

      if (result.success) {
        Alert.alert(
          'Success',
          `Item ${type === 'lost' ? 'lost' : 'found'} reported successfully!`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form
                setItemName('');
                setDescription('');
                setLocation('');
                setContactNumber('');
                setLostDate('');
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
              <Text className="text-3xl font-bold text-white">Report Item</Text>
              <Text className="text-gray-400 text-base mt-1">
                Post lost or found item details
              </Text>
            </View>
          </View>
        </View>

        {/* Type Selector */}
        <View className="px-6 mb-8">
          <Text className="text-white text-base font-semibold mb-4">Item Type *</Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => setType('lost')}
              className={`flex-1 py-4 rounded-2xl border-2 ${
                type === 'lost' 
                  ? 'bg-orange-500 border-orange-500' 
                  : 'bg-gray-900 border-gray-700'
              }`}
            >
              <Text className={`text-center font-bold text-base ${
                type === 'lost' ? 'text-white' : 'text-gray-400'
              }`}>
                Lost Item
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType('found')}
              className={`flex-1 py-4 rounded-2xl border-2 ${
                type === 'found' 
                  ? 'bg-orange-500 border-orange-500' 
                  : 'bg-gray-900 border-gray-700'
              }`}
            >
              <Text className={`text-center font-bold text-base ${
                type === 'found' ? 'text-white' : 'text-gray-400'
              }`}>
                Found Item
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View className="px-6 space-y-5">
          {/* Item Name */}
          <View className="mb-5">
            <Text className="text-white text-base font-semibold mb-3">Item Name *</Text>
            <TextInput
              className="bg-gray-900 text-white px-6 py-4 rounded-2xl border-2 border-gray-700 text-base"
              placeholder="e.g., Black Wallet, iPhone 13, etc."
              placeholderTextColor="#9CA3AF"
              value={itemName}
              onChangeText={setItemName}
            />
          </View>

          {/* Description */}
          <View className="mb-5">
            <Text className="text-white text-base font-semibold mb-3">Description *</Text>
            <TextInput
              className="bg-gray-900 text-white px-6 py-4 rounded-2xl border-2 border-gray-700 text-base"
              placeholder="Describe the item in detail..."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 120 }}
            />
          </View>

          {/* Date */}
          <View className="mb-5">
            <Text className="text-white text-base font-semibold mb-3">
              {type === 'lost' ? 'Date Lost' : 'Date Found'} *
            </Text>
            <TextInput
              className="bg-gray-900 text-white px-6 py-4 rounded-2xl border-2 border-gray-700 text-base"
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#9CA3AF"
              value={lostDate}
              onChangeText={setLostDate}
            />
          </View>

          {/* Location */}
          <View className="mb-5">
            <Text className="text-white text-base font-semibold mb-3">Location</Text>
            <TextInput
              className="bg-gray-900 text-white px-6 py-4 rounded-2xl border-2 border-gray-700 text-base"
              placeholder="e.g., Library, Cafeteria, Parking Lot"
              placeholderTextColor="#9CA3AF"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Contact Number */}
          <View className="mb-5">
            <Text className="text-white text-base font-semibold mb-3">Contact Number *</Text>
            <TextInput
              className="bg-gray-900 text-white px-6 py-4 rounded-2xl border-2 border-orange-500 text-base"
              placeholder="Your contact number"
              placeholderTextColor="#9CA3AF"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Image Upload */}
          <View className="mb-8">
            <Text className="text-white text-base font-semibold mb-3">Item Image (Optional)</Text>
            <TouchableOpacity
              onPress={pickImage}
              className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl p-8 items-center justify-center"
            >
              {image ? (
                <View className="items-center">
                  <MaterialIcons name="check-circle" size={48} color="#10B981" />
                  <Text className="text-green-500 font-semibold mt-3">Image Selected</Text>
                  <Text className="text-gray-400 text-sm mt-1">Tap to change</Text>
                </View>
              ) : (
                <View className="items-center">
                  <MaterialIcons name="cloud-upload" size={48} color="#F97316" />
                  <Text className="text-white font-semibold mt-3">Upload Image</Text>
                  <Text className="text-gray-400 text-sm mt-1">Tap to select from gallery</Text>
                </View>
              )}
            </TouchableOpacity>
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
                Submit Report
              </Text>
            )}
          </TouchableOpacity>

          {/* Info Card */}
          <View className="bg-gray-900 p-5 rounded-2xl border-2 border-gray-800 mb-6">
            <View className="flex-row items-start">
              <MaterialIcons name="info" size={24} color="#F97316" />
              <View className="flex-1 ml-3">
                <Text className="text-white font-semibold mb-2">Important Note</Text>
                <Text className="text-gray-400 text-sm leading-5">
                  Please provide accurate information. Your contact details will be visible to help others reach you.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
