// app/auth/signup.tsx
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import '../../global.css';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const { signup, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const result = await signup(name, email, password);
    setIsLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/');
    } else {
      Alert.alert('Error', result.message || 'Signup failed');
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
          <Text className="text-4xl font-bold text-white">Create Account</Text>
        </View>
        <Text className="text-center text-gray-400 text-base">
          Join Student Connect today
        </Text>
      </View>

      {/* Form */}
      <View className="px-6 space-y-4">
        {/* Full Name Input */}
        <View className="mb-4">
          <TextInput
            className={`bg-gray-900 text-white px-6 py-4 rounded-2xl text-base ${
              focusedField === 'name' ? 'border-2 border-orange-500' : 'border border-gray-700'
            }`}
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <TextInput
            className={`bg-gray-900 text-white px-6 py-4 rounded-2xl text-base ${
              focusedField === 'email' ? 'border-2 border-orange-500' : 'border border-gray-700'
            }`}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <TextInput
            className={`bg-gray-900 text-white px-6 py-4 rounded-2xl text-base ${
              focusedField === 'password' ? 'border-2 border-orange-500' : 'border border-gray-700'
            }`}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          className={`bg-orange-500 py-5 rounded-2xl items-center shadow-lg ${
            isLoading || loading ? 'opacity-50' : ''
          }`}
          onPress={handleSignup}
          disabled={isLoading || loading}
        >
          {isLoading || loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-black font-bold text-lg">Sign Up</Text>
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
            Sign up with Google
          </Text>
        </TouchableOpacity>

        {/* Info Text */}
        <View className="mt-4 px-2">
          <Text className="text-gray-500 text-xs text-center">
            Note: Google Sign-In requires OAuth configuration.{'\n'}
            For now, use Email/Password signup above.
          </Text>
        </View>

        {/* Login Link */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-gray-400 text-base">
            Already have an account?{' '}
          </Text>
          <Link href="/auth/login" asChild>
            <TouchableOpacity>
              <Text className="text-orange-500 font-bold text-base">Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
