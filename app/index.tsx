import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import '../global.css';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function Index() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');

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

  const features = [
    { id: 1, title: 'Skill Help', icon: 'school', iconColor: '#3B82F6' },
    { id: 2, title: 'Ask Anon', icon: 'help-outline', iconColor: '#10B981' },
    { id: 3, title: 'Notices', icon: 'announcement', iconColor: '#8B5CF6' },
    { id: 4, title: 'Lost & Found', icon: 'find-in-page', iconColor: '#F59E0B' },
    { id: 5, title: 'Marketplace', icon: 'shopping-cart', iconColor: '#14B8A6' },
    { id: 6, title: 'Notes Hub', icon: 'book', iconColor: '#EF4444' },
    { id: 7, title: 'Peer Tuition', icon: 'groups', iconColor: '#3B82F6' },
    { id: 8, title: 'Feedback', icon: 'star', iconColor: '#F59E0B' },
  ];

  const handleFeatureClick = (feature: string) => {
    if (feature === 'Lost & Found') {
      router.push('/lostfound');
    } else {
      Alert.alert(feature, 'This feature will be available soon!');
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-16 pb-8 bg-gray-900">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 pr-4">
              <Text className="text-3xl font-bold text-white mb-2">CampusConnect</Text>
              <Text className="text-gray-400 text-base">One Platform for All College Needs</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity 
                onPress={() => Alert.alert('Notifications', 'No new notifications')}
                className="p-3 bg-gray-800 rounded-full"
              >
                <Ionicons name="notifications-outline" size={24} color="#F97316" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleLogout}
                className="w-12 h-12 rounded-full bg-orange-500 items-center justify-center"
              >
                <Text className="text-white text-lg font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Access Section */}
        <View className="px-6 pt-8 pb-4">
          <Text className="text-2xl font-bold text-white mb-6">Quick Access</Text>
          
          <View className="flex-row flex-wrap justify-between">
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                onPress={() => handleFeatureClick(feature.title)}
                className="bg-gray-900 rounded-3xl p-5 mb-5 items-center justify-center"
                style={{ width: '47%', minHeight: 170 }}
              >
                <View 
                  className="w-20 h-20 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: feature.iconColor + '20' }}
                >
                  <MaterialIcons name={feature.icon as any} size={36} color={feature.iconColor} />
                </View>
                <Text className="text-white text-base font-semibold text-center">
                  {feature.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Center Action Button */}
        <View className="items-center py-8">
          <TouchableOpacity
            onPress={() => Alert.alert('Quick Action', 'Opening quick actions...')}
            className="w-20 h-20 rounded-full bg-gray-800 items-center justify-center border-4 border-gray-700"
          >
            <Ionicons name="play" size={36} color="#F97316" />
          </TouchableOpacity>
        </View>

        {/* Bottom Banner */}
        <View className="px-6 py-8">
          <View className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 items-center shadow-lg">
            <Text className="text-white text-xl font-bold text-center mb-5 leading-7">
              Get Help. Share Knowledge. Stay Connected.
            </Text>
            <TouchableOpacity 
              className="bg-white rounded-full px-10 py-4"
              onPress={() => Alert.alert('Ask a Question', 'Opening question form...')}
            >
              <Text className="text-orange-500 font-bold text-base">Ask a Question</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Extra padding for bottom nav */}
        <View className="h-24" />
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-2xl">
        <View className="flex-row justify-around items-center py-3 px-4">
          <TouchableOpacity 
            className="items-center py-2 px-3"
            onPress={() => setActiveTab('home')}
          >
            <Ionicons 
              name={activeTab === 'home' ? 'home' : 'home-outline'} 
              size={26} 
              color={activeTab === 'home' ? '#F97316' : '#6B7280'} 
            />
            <Text className={`text-xs mt-1 font-medium ${activeTab === 'home' ? 'text-orange-500' : 'text-gray-500'}`}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="items-center py-2 px-3"
            onPress={() => {
              setActiveTab('search');
              Alert.alert('Search', 'Search feature coming soon...');
            }}
          >
            <Ionicons 
              name={activeTab === 'search' ? 'search' : 'search-outline'} 
              size={26} 
              color={activeTab === 'search' ? '#F97316' : '#6B7280'} 
            />
            <Text className={`text-xs mt-1 font-medium ${activeTab === 'search' ? 'text-orange-500' : 'text-gray-500'}`}>
              Search
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="items-center -mt-8"
            onPress={() => {
              setActiveTab('post');
              Alert.alert('Post', 'Create new post...');
            }}
          >
            <View className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 items-center justify-center border-4 border-black shadow-xl">
              <Ionicons name="add" size={36} color="white" />
            </View>
            <Text className="text-xs mt-2 text-gray-500 font-medium">Post</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="items-center py-2 px-3"
            onPress={() => {
              setActiveTab('messages');
              Alert.alert('Messages', 'Messages feature coming soon...');
            }}
          >
            <Ionicons 
              name={activeTab === 'messages' ? 'chatbubble' : 'chatbubble-outline'} 
              size={26} 
              color={activeTab === 'messages' ? '#F97316' : '#6B7280'} 
            />
            <Text className={`text-xs mt-1 font-medium ${activeTab === 'messages' ? 'text-orange-500' : 'text-gray-500'}`}>
              Messages
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="items-center py-2 px-3"
            onPress={() => {
              setActiveTab('profile');
              Alert.alert('Profile', 'Profile feature coming soon...');
            }}
          >
            <Ionicons 
              name={activeTab === 'profile' ? 'person' : 'person-outline'} 
              size={26} 
              color={activeTab === 'profile' ? '#F97316' : '#6B7280'} 
            />
            <Text className={`text-xs mt-1 font-medium ${activeTab === 'profile' ? 'text-orange-500' : 'text-gray-500'}`}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}