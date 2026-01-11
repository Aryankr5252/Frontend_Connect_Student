import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import '../global.css';

// Import icons from @expo/vector-icons
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

export default function Index() {
  // Mock data for the sections
  const quickAccessFeatures = [
    { id: 1, title: 'Skill Help', icon: 'school', color: '#F59E0B', bgColor: '#FFEDD5' },
    { id: 2, title: 'Ask Anonymous', icon: 'help-outline', color: '#FB7102', bgColor: '#FEECDC' },
    { id: 3, title: 'Notices', icon: 'announcement', color: '#FF5500', bgColor: '#FFE5CC' },
    { id: 4, title: 'Lost & Found', icon: 'find-in-page', color: '#F97316', bgColor: '#FED7AA' },
    { id: 5, title: 'Marketplace', icon: 'shopping-cart', color: '#EA580C', bgColor: '#FDBA74' },
    { id: 6, title: 'Notes Hub', icon: 'book', color: '#DC2626', bgColor: '#FECACA' },
    { id: 7, title: 'Peer Tuition', icon: 'groups', color: '#B45309', bgColor: '#FCD34D' },
    { id: 8, title: 'Feedback', icon: 'rate-review', color: '#92400E', bgColor: '#FDE68A' },
  ];

  const latestNotices = [
    { id: 1, title: 'Semester exams schedule released', date: 'Today', priority: 'high' },
    { id: 2, title: 'Library hours extended till 9 PM', date: 'Yesterday', priority: 'medium' },
    { id: 3, title: 'Career fair on March 15th', date: 'Mar 10', priority: 'low' },
  ];

  const recentFoundItems = [
    { id: 1, item: 'Black wallet near CS dept', date: '2 hours ago', status: 'claimed' },
    { id: 2, item: 'Red water bottle in cafeteria', date: '5 hours ago', status: 'available' },
  ];

  const trendingSkills = [
    { id: 1, skill: 'Python', demand: 'High', level: 90 },
    { id: 2, skill: 'React Native', demand: 'Medium', level: 70 },
    { id: 3, skill: 'Data Science', demand: 'High', level: 85 },
  ];

  const [activeTab, setActiveTab] = useState('home');

  // Function to handle feature clicks
  const handleFeatureClick = (featureTitle: string) => {
    Alert.alert(`${featureTitle} Selected`, `You selected ${featureTitle}. This feature will be implemented soon!`);
  };

  // Function to handle notice clicks
  const handleNoticeClick = (notice: any) => {
    Alert.alert(`Notice: ${notice.title}`, `Date: ${notice.date}\nPriority: ${notice.priority}`);
  };

  // Function to handle lost & found item clicks
  const handleItemClick = (item: any) => {
    Alert.alert(`Item: ${item.item}`, `Status: ${item.status}\nFound: ${item.date}`);
  };

  // Function to handle skill clicks
  const handleSkillClick = (skill: any) => {
    Alert.alert(`Skill: ${skill.skill}`, `Demand: ${skill.demand}\nProficiency: ${skill.level}%`);
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-black to-gray-900">
      {/* Animated Top Header */}
      <View className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-6 shadow-lg">
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-3xl font-bold text-white drop-shadow-lg">CampusConnect</Text>
            <Text className="text-base text-orange-100 mt-1">One Platform for All College Needs</Text>
          </View>
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              className="p-3 rounded-full bg-orange-700 bg-opacity-50 active:bg-orange-800 transition-all"
              onPress={() => Alert.alert('Notifications', 'You have 3 new notifications')}
            >
              <MaterialIcons name="notifications" size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-1 rounded-full border-2 border-orange-300 active:scale-95 transition-transform"
              onPress={() => Alert.alert('Profile', 'Opening profile page...')}
            >
              <View className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 justify-center items-center">
                <Text className="font-bold text-white text-lg">JS</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Welcome Message */}
      <View className="px-4 py-3">
        <Text className="text-orange-200 text-lg font-medium">Welcome back, John!</Text>
        <Text className="text-orange-400 text-sm">Ready to connect and learn today?</Text>
      </View>

      {/* Quick Access Feature Grid */}
      <View className="px-4 py-4">
        <Text className="text-xl font-bold text-orange-400 mb-4">Quick Access</Text>
        <View className="flex-row flex-wrap justify-between">
          {quickAccessFeatures.map((feature) => (
            <TouchableOpacity 
              key={feature.id} 
              className="items-center p-4 rounded-2xl shadow-lg mb-4 border border-orange-900 active:scale-95 transition-transform"
              style={{ 
                width: '23%',
                backgroundColor: feature.bgColor,
              }}
              onPress={() => handleFeatureClick(feature.title)}
            >
              <View 
                className="w-14 h-14 rounded-full items-center justify-center mb-2 shadow-md" 
                style={{ backgroundColor: feature.color }}
              >
                <MaterialIcons name={feature.icon as any} size={28} color="white" />
              </View>
              <Text className="text-xs text-center font-bold text-gray-800 mt-1">{feature.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Highlight Banner Section */}
      <View className="mx-4 my-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-3xl p-6 shadow-2xl border border-orange-400">
        <Text className="text-black text-xl font-extrabold text-center mb-3 drop-shadow-sm">Get Help. Share Knowledge. Stay Connected.</Text>
        <TouchableOpacity 
          className="bg-black rounded-full py-3 px-6 mt-3 self-center w-40 border-2 border-orange-400 active:bg-orange-900 transition-colors"
          onPress={() => Alert.alert('Ask a Question', 'Opening question posting interface...')}
        >
          <Text className="text-orange-400 font-bold text-center text-lg">Ask a Question</Text>
        </TouchableOpacity>
      </View>

      {/* Activity & Updates Section */}
      <View className="px-4 mb-4">
        <Text className="text-xl font-bold text-orange-400 mb-4">Recent Updates</Text>
        
        {/* Latest Notices */}
        <View className="mb-5">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-orange-500 justify-center items-center mr-3">
              <Feather name="bell" size={20} color="white" />
            </View>
            <Text className="font-bold text-orange-300 text-lg">Latest Notices</Text>
          </View>
          <View className="bg-black rounded-2xl p-4 shadow-lg border border-orange-900">
            {latestNotices.map((notice) => (
              <TouchableOpacity 
                key={notice.id} 
                className="py-3 border-b border-orange-900 last:border-0 flex-row items-start"
                onPress={() => handleNoticeClick(notice)}
              >
                <View className={`w-3 h-3 rounded-full mt-2 mr-3 ${notice.priority === 'high' ? 'bg-red-500' : notice.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <View className="flex-1">
                  <Text className="font-semibold text-orange-100">{notice.title}</Text>
                  <Text className="text-xs text-orange-400 mt-1">{notice.date}</Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${notice.priority === 'high' ? 'bg-red-900' : notice.priority === 'medium' ? 'bg-yellow-900' : 'bg-green-900'}`}>
                  <Text className={`text-xs ${notice.priority === 'high' ? 'text-red-300' : notice.priority === 'medium' ? 'text-yellow-300' : 'text-green-300'}`}>{notice.priority}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recently Found Items */}
        <View className="mb-5">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-orange-600 justify-center items-center mr-3">
              <Ionicons name="location-sharp" size={20} color="white" />
            </View>
            <Text className="font-bold text-orange-300 text-lg">Recently Found</Text>
          </View>
          <View className="bg-black rounded-2xl p-4 shadow-lg border border-orange-900">
            {recentFoundItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className="py-3 border-b border-orange-900 last:border-0 flex-row items-center"
                onPress={() => handleItemClick(item)}
              >
                <View className={`w-3 h-3 rounded-full mr-3 ${item.status === 'available' ? 'bg-green-500' : 'bg-gray-500'}`} />
                <View className="flex-1">
                  <Text className="font-semibold text-orange-100">{item.item}</Text>
                  <Text className="text-xs text-orange-400 mt-1">{item.date}</Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${item.status === 'available' ? 'bg-green-900' : 'bg-gray-900'}`}>
                  <Text className={`text-xs ${item.status === 'available' ? 'text-green-300' : 'text-gray-300'}`}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Skills */}
        <View>
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-orange-700 justify-center items-center mr-3">
              <MaterialIcons name="trending-up" size={20} color="white" />
            </View>
            <Text className="font-bold text-orange-300 text-lg">Trending Skills</Text>
          </View>
          <View className="bg-black rounded-2xl p-4 shadow-lg border border-orange-900">
            {trendingSkills.map((skill) => (
              <TouchableOpacity 
                key={skill.id} 
                className="py-3 border-b border-orange-900 last:border-0"
                onPress={() => handleSkillClick(skill)}
              >
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="font-semibold text-orange-100">{skill.skill}</Text>
                  <Text className="text-xs text-green-400">{skill.demand} Demand</Text>
                </View>
                <View className="h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
                  <View 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" 
                    style={{ width: `${skill.level}%` }}
                  />
                </View>
                <Text className="text-xs text-orange-400 mt-1">{skill.level}% proficiency</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Reputation & Credits Widget */}
      <View className="mx-4 mb-4 bg-gradient-to-r from-orange-600 to-black rounded-2xl p-5 shadow-2xl border-2 border-orange-500">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-black/50 items-center justify-center mr-4 border-2 border-orange-400">
              <MaterialIcons name="star" size={24} color="orange" />
            </View>
            <View>
              <Text className="text-orange-100 font-bold text-lg">Helper Badge</Text>
              <Text className="text-orange-200 text-base">50 Points Earned</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-orange-200 text-right text-sm font-medium">🏆 Top Helper</Text>
            <Text className="text-orange-300 text-right text-xs">+5 points today</Text>
          </View>
        </View>
      </View>

      {/* Bottom Navigation Bar */}
      <View className="flex-row justify-around items-center bg-black py-4 px-2 border-t-2 border-orange-500">
        <TouchableOpacity 
          className={`items-center ${activeTab === 'home' ? 'text-orange-400' : 'text-gray-500'}`}
          onPress={() => {
            setActiveTab('home');
            Alert.alert('Navigation', 'Already on Home page');
          }}
        >
          <Ionicons name="home" size={28} color={activeTab === 'home' ? "#F59E0B" : "#6B7280"} />
          <Text className={`text-xs mt-1 font-medium ${activeTab === 'home' ? 'text-orange-400' : 'text-gray-500'}`}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="items-center"
          onPress={() => {
            setActiveTab('search');
            Alert.alert('Navigation', 'Opening Search page...');
          }}
        >
          <Ionicons name="search" size={28} color="#6B7280" />
          <Text className="text-xs mt-1 text-gray-500">Search</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="items-center w-16 h-16 -mt-8 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full justify-center border-4 border-black active:scale-95 transition-transform"
          onPress={() => {
            setActiveTab('post');
            Alert.alert('Post', 'Opening post creation interface...');
          }}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          className="items-center"
          onPress={() => {
            setActiveTab('messages');
            Alert.alert('Navigation', 'Opening Messages page...');
          }}
        >
          <Ionicons name="chatbubble-ellipses" size={28} color="#6B7280" />
          <Text className="text-xs mt-1 text-gray-500">Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="items-center"
          onPress={() => {
            setActiveTab('profile');
            Alert.alert('Navigation', 'Opening Profile page...');
          }}
        >
          <Ionicons name="person" size={28} color="#6B7280" />
          <Text className="text-xs mt-1 text-gray-500">Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}