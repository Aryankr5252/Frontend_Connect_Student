import { View, Text, ImageBackground } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Link } from "expo-router";
import AuthInput from "@/components/Auth/AuthInput";
import AuthButton from "@/components/Auth/AuthButton";

export default function Signup() {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
      }}
      resizeMode="cover"
      className="flex-1" >
      {/* Dark Overlay */}
      <View className="flex-1 bg-black/80 justify-center px-6">

        <Animated.Text
          entering={FadeInDown.duration(600)}
          className="text-3xl font-bold text-center text-white mb-2" >
          Create Account ✨
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(100)}
          className="text-center text-gray-400 mb-8" >
          Join Student Connect today
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(200)}>
          <AuthInput
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"/>
          <AuthInput
            placeholder="Email"
            placeholderTextColor="#9CA3AF"/>
          <AuthInput
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <AuthButton title="Sign Up" />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(600)}
          className="text-center mt-6 text-gray-400"
        >
          Already have an account?{" "}
          <Link href="/auth/login" className="text-orange-400 font-semibold">
            Login
          </Link>
        </Animated.Text>

      </View>
    </ImageBackground>
  );
}
