// app/auth/login.tsx
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import '../../global.css';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Login successful!');
      router.replace('/');
    } else {
      Alert.alert('Error', result.message || 'Login failed');
    }
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <ScrollView 
      className="flex-1 bg-black"
      contentContainerStyle={{ paddingVertical: 40 }}
    >
      {/* Header */}
      <View className="px-6 mb-10 mt-20">
        <View className="flex-row items-center justify-center mb-4">
          <Text className="text-4xl font-bold text-white">Welcome Back</Text>
          <Text className="text-4xl ml-2">👋</Text>
        </View>
        <Text className="text-center text-gray-400 text-base">
          Login to Student Connect
        </Text>
      </View>

      {/* Form */}
      <View className="px-6 space-y-4">
        {/* Email Input */}
        <View className="mb-4">
          <TextInput
            className="bg-gray-900 text-white px-6 py-4 rounded-2xl border border-gray-700 text-base"
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <TextInput
            className="bg-gray-900 text-white px-6 py-4 rounded-2xl border-2 border-orange-500 text-base"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className={`bg-orange-500 py-5 rounded-2xl items-center shadow-lg ${
            isLoading || loading ? 'opacity-50' : ''
          }`}
          onPress={handleLogin}
          disabled={isLoading || loading}
        >
          {isLoading || loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-black font-bold text-lg">Login</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-700" />
          <Text className="mx-4 text-gray-400">or continue with</Text>
          <View className="flex-1 h-px bg-gray-700" />
        </View>

        {/* Google Sign In Button */}
        <TouchableOpacity
          className="bg-white py-4 rounded-2xl items-center flex-row justify-center border border-gray-300"
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <MaterialIcons name="g-translate" size={24} color="#EA4335" />
          <Text className="text-black font-semibold text-base ml-3">
            Login with Google
          </Text>
        </TouchableOpacity>

        {/* Info Text */}
        <View className="mt-4 px-2">
          <Text className="text-gray-500 text-xs text-center">
            Note: Google Sign-In requires OAuth configuration.{'\n'}
            For now, use Email/Password login above.
          </Text>
        </View>

        {/* Forgot Password Link */}
        <View className="items-center mt-4">
          <TouchableOpacity>
            <Text className="text-gray-400 text-sm">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Signup Link */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-gray-400 text-base">
            Don't have an account?{' '}
          </Text>
          <Link href="/auth/signup" asChild>
            <TouchableOpacity>
              <Text className="text-orange-500 font-bold text-base">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
