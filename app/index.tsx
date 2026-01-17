import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import '../global.css';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getUserLostFoundItems } from '../services/lostFoundService';
import { getUserMarketplaceItems } from '../services/marketplaceService';
import { updateProfile } from '../services/authService';

export default function Index() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [showPostModal, setShowPostModal] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (activeTab === 'profile') {
      fetchUserPostsCount();
    }
  }, [activeTab]);

  const fetchUserPostsCount = async () => {
    try {
      const [lostFoundResponse, marketplaceResponse] = await Promise.all([
        getUserLostFoundItems(),
        getUserMarketplaceItems(),
      ]);
      
      const lostFoundCount = lostFoundResponse?.success ? (lostFoundResponse.data?.length || 0) : 0;
      const marketplaceCount = marketplaceResponse?.success ? (marketplaceResponse.data?.length || 0) : 0;
      const total = lostFoundCount + marketplaceCount;
      
      console.log('Posts count - Lost/Found:', lostFoundCount, 'Marketplace:', marketplaceCount, 'Total:', total);
      setTotalPosts(total);
    } catch (error) {
      console.error('Error fetching posts count:', error);
      setTotalPosts(0);
    }
  };

  const handleEditProfile = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setShowEditModal(true);
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!editEmail.trim()) {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await updateProfile(editName.trim(), editEmail.trim());
      if (response.success) {
        Alert.alert('Success', 'Profile updated successfully');
        setShowEditModal(false);
        // Refresh user data
        await refreshUser();
      } else {
        Alert.alert('Error', response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

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
    { id: 3, title: 'Lost & Found', icon: 'find-in-page', iconColor: '#F59E0B' },
    { id: 4, title: 'Marketplace', icon: 'shopping-cart', iconColor: '#14B8A6' },
    { id: 5, title: 'Notices', icon: 'announcement', iconColor: '#8B5CF6' },
    { id: 6, title: 'Notes Hub', icon: 'book', iconColor: '#EF4444' },
    { id: 7, title: 'Peer Tuition', icon: 'groups', iconColor: '#3B82F6' },
    { id: 8, title: 'Feedback', icon: 'star', iconColor: '#F59E0B' },
  ];

  const handleFeatureClick = (feature: string) => {
    if (feature === 'Lost & Found') {
      router.push('/lostfound');
    } else if (feature === 'Marketplace') {
      router.push('/marketplace');
    } else {
      Alert.alert(feature, 'This feature will be available soon!');
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {activeTab === 'home' ? (
          // Home Content
          <>
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
          </>
        ) : activeTab === 'profile' ? (
          // Profile Content
          <>
        <View className="px-6 pt-16 pb-8 bg-gray-900">
          <Text className="text-3xl font-bold text-white">Profile</Text>
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
                <Text className="text-white text-2xl font-bold">{totalPosts}</Text>
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
              onPress={handleEditProfile}
            >
              <Text className="text-white text-center font-bold text-base">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 mt-8">
          <Text className="text-white text-xl font-bold mb-4">Account</Text>
          
          <View className="bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-800">
            <TouchableOpacity className="flex-row items-center p-5 active:bg-gray-800" onPress={handleEditProfile}>
              <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#3B82F620' }}>
                <MaterialIcons name="edit" size={24} color="#3B82F6" />
              </View>
              <Text className="flex-1 text-white text-base font-semibold ml-4">Edit Profile</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>
            <View className="h-px bg-gray-800 ml-20" />
            
            <TouchableOpacity className="flex-row items-center p-5 active:bg-gray-800" onPress={() => router.push('/myposts/index')}>
              <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#10B98120' }}>
                <MaterialIcons name="post-add" size={24} color="#10B981" />
              </View>
              <Text className="flex-1 text-white text-base font-semibold ml-4">My Posts</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>
            <View className="h-px bg-gray-800 ml-20" />
            
            <TouchableOpacity className="flex-row items-center p-5 active:bg-gray-800" onPress={() => Alert.alert('Saved Items', 'Feature coming soon!')}>
              <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#F59E0B20' }}>
                <MaterialIcons name="bookmark" size={24} color="#F59E0B" />
              </View>
              <Text className="flex-1 text-white text-base font-semibold ml-4">Saved Items</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>
            <View className="h-px bg-gray-800 ml-20" />
            
            <TouchableOpacity className="flex-row items-center p-5 active:bg-gray-800" onPress={() => Alert.alert('Settings', 'Feature coming soon!')}>
              <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#8B5CF620' }}>
                <MaterialIcons name="settings" size={24} color="#8B5CF6" />
              </View>
              <Text className="flex-1 text-white text-base font-semibold ml-4">Settings</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>
            <View className="h-px bg-gray-800 ml-20" />
            
            <TouchableOpacity className="flex-row items-center p-5 active:bg-gray-800" onPress={() => Alert.alert('Help & Support', 'Feature coming soon!')}>
              <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#14B8A620' }}>
                <MaterialIcons name="help-outline" size={24} color="#14B8A6" />
              </View>
              <Text className="flex-1 text-white text-base font-semibold ml-4">Help & Support</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>
            <View className="h-px bg-gray-800 ml-20" />
            
            <TouchableOpacity className="flex-row items-center p-5 active:bg-gray-800" onPress={() => Alert.alert('About', 'CampusConnect v1.0.0\nYour one-stop college platform')}>
              <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#6B728020' }}>
                <MaterialIcons name="info-outline" size={24} color="#6B7280" />
              </View>
              <Text className="flex-1 text-white text-base font-semibold ml-4">About</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>
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
          </>
        ) : null}
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
              setShowPostModal(true);
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
            onPress={() => setActiveTab('profile')}
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

      {/* Post Options Modal */}
      <Modal
        visible={showPostModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPostModal(false)}
      >
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => setShowPostModal(false)}
          className="flex-1 bg-black/80 justify-center items-center"
        >
          <TouchableOpacity 
            activeOpacity={1}
            className="bg-gray-900 rounded-3xl p-6 mx-6 w-80"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View className="items-center mb-6">
              <View className="w-16 h-16 rounded-full bg-orange-500/20 items-center justify-center mb-4">
                <MaterialIcons name="add-circle" size={36} color="#F97316" />
              </View>
              <Text className="text-white text-2xl font-bold">Create Post</Text>
              <Text className="text-gray-400 text-sm mt-2">Choose what you want to post</Text>
            </View>

            {/* Options */}
            <View className="gap-3">
              {/* Marketplace Option */}
              <TouchableOpacity
                onPress={() => {
                  setShowPostModal(false);
                  router.push('/marketplace/create');
                }}
                className="bg-gray-800 rounded-2xl p-5 border-2 border-gray-700 active:border-orange-500"
              >
                <View className="flex-row items-center">
                  <View className="w-14 h-14 rounded-full bg-teal-500/20 items-center justify-center">
                    <MaterialIcons name="shopping-cart" size={28} color="#14B8A6" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-white text-lg font-bold">Marketplace</Text>
                    <Text className="text-gray-400 text-sm mt-1">Sell your items</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                </View>
              </TouchableOpacity>

              {/* Lost & Found Option */}
              <TouchableOpacity
                onPress={() => {
                  setShowPostModal(false);
                  router.push('/lostfound/create');
                }}
                className="bg-gray-800 rounded-2xl p-5 border-2 border-gray-700 active:border-orange-500"
              >
                <View className="flex-row items-center">
                  <View className="w-14 h-14 rounded-full bg-amber-500/20 items-center justify-center">
                    <MaterialIcons name="find-in-page" size={28} color="#F59E0B" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-white text-lg font-bold">Lost & Found</Text>
                    <Text className="text-gray-400 text-sm mt-1">Report lost or found items</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={() => setShowPostModal(false)}
              className="mt-6 py-4 rounded-2xl border-2 border-gray-700"
            >
              <Text className="text-gray-400 text-center font-bold text-base">Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
      >
        <TouchableOpacity 
          className="flex-1 bg-black/80"
          activeOpacity={1}
          onPress={() => !isUpdating && setShowEditModal(false)}
        >
          <TouchableOpacity 
            activeOpacity={1}
            className="flex-1 justify-center px-6"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="bg-gray-900 rounded-3xl p-6 border-2 border-gray-800">
              <Text className="text-2xl font-bold text-white mb-6 text-center">Edit Profile</Text>
              
              {/* Name Input */}
              <View className="mb-4">
                <Text className="text-gray-400 text-sm mb-2">Name</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                  placeholderTextColor="#6B7280"
                  className="bg-gray-800 text-white px-4 py-4 rounded-2xl text-base border-2 border-gray-700"
                  editable={!isUpdating}
                />
              </View>

              {/* Email Input */}
              <View className="mb-6">
                <Text className="text-gray-400 text-sm mb-2">Email</Text>
                <TextInput
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#6B7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-gray-800 text-white px-4 py-4 rounded-2xl text-base border-2 border-gray-700"
                  editable={!isUpdating}
                />
              </View>

              {/* Buttons */}
              <TouchableOpacity
                onPress={handleUpdateProfile}
                disabled={isUpdating}
                className="bg-orange-500 rounded-2xl py-4 mb-3"
              >
                {isUpdating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-bold text-base">Update Profile</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                disabled={isUpdating}
                className="py-4 rounded-2xl border-2 border-gray-700"
              >
                <Text className="text-gray-400 text-center font-bold text-base">Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}