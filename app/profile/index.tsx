// app/profile/index.tsx
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import '../../global.css';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/signup');
          },
        },
      ]
    );
  };

  const menuItems = [
    { id: 1, title: 'Edit Profile', icon: 'edit', iconColor: '#3B82F6', action: () => Alert.alert('Edit Profile', 'Feature coming soon!') },
    { id: 2, title: 'My Posts', icon: 'post-add', iconColor: '#10B981', action: () => Alert.alert('My Posts', 'Feature coming soon!') },
    { id: 3, title: 'Saved Items', icon: 'bookmark', iconColor: '#F59E0B', action: () => Alert.alert('Saved Items', 'Feature coming soon!') },
    { id: 4, title: 'Settings', icon: 'settings', iconColor: '#8B5CF6', action: () => Alert.alert('Settings', 'Feature coming soon!') },
    { id: 5, title: 'Help & Support', icon: 'help-outline', iconColor: '#14B8A6', action: () => Alert.alert('Help & Support', 'Feature coming soon!') },
    { id: 6, title: 'About', icon: 'info-outline', iconColor: '#6B7280', action: () => Alert.alert('About', 'CampusConnect v1.0.0\nYour one-stop college platform') },
  ];

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-16 pb-8 bg-gray-900">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-3xl font-bold text-white">Profile</Text>
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-3 bg-gray-800 rounded-full"
            >
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card */}
        <View className="px-6 -mt-4">
          <View className="bg-gray-900 rounded-3xl p-6 border-2 border-gray-800">
            {/* Avatar & Info */}
            <View className="items-center mb-6">
              <View className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 items-center justify-center mb-4 border-4 border-orange-400">
                <Text className="text-white text-4xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </Text>
              </View>
              <Text className="text-white text-2xl font-bold mb-2">
                {user?.name || 'Student'}
              </Text>
              <Text className="text-gray-400 text-base">
                {user?.email || 'student@college.edu'}
              </Text>
            </View>

            {/* Stats */}
            <View className="flex-row justify-around py-4 border-t border-b border-gray-800">
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">0</Text>
                <Text className="text-gray-400 text-sm mt-1">Posts</Text>
              </View>
              <View className="w-px bg-gray-800" />
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">0</Text>
                <Text className="text-gray-400 text-sm mt-1">Items</Text>
              </View>
              <View className="w-px bg-gray-800" />
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">0</Text>
                <Text className="text-gray-400 text-sm mt-1">Saved</Text>
              </View>
            </View>

            {/* Quick Edit Button */}
            <TouchableOpacity 
              className="mt-6 bg-orange-500 rounded-2xl py-4"
              onPress={() => Alert.alert('Edit Profile', 'Feature coming soon!')}
            >
              <Text className="text-white text-center font-bold text-base">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 mt-8">
          <Text className="text-white text-xl font-bold mb-4">Account</Text>
          
          <View className="bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-800">
            {menuItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  onPress={item.action}
                  className="flex-row items-center p-5 active:bg-gray-800"
                >
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: item.iconColor + '20' }}
                  >
                    <MaterialIcons name={item.icon as any} size={24} color={item.iconColor} />
                  </View>
                  <Text className="flex-1 text-white text-base font-semibold ml-4">
                    {item.title}
                  </Text>
                  <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
                </TouchableOpacity>
                {index < menuItems.length - 1 && (
                  <View className="h-px bg-gray-800 ml-20" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 mt-8 mb-24">
          <TouchableOpacity 
            onPress={handleLogout}
            className="bg-red-900/30 border-2 border-red-500/50 rounded-2xl py-5"
          >
            <View className="flex-row items-center justify-center">
              <MaterialIcons name="logout" size={24} color="#EF4444" />
              <Text className="text-red-500 font-bold text-base ml-3">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
