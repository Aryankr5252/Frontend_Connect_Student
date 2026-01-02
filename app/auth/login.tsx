import { View, Text, ImageBackground } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Link } from "expo-router";
import AuthInput from "@/components/Auth/AuthInput";
import AuthButton from "@/components/Auth/AuthButton";

export default function Login() {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
      }}
      resizeMode="cover"
      className="flex-1">
      {/* Overlay */}
      <View className="flex-1 bg-black/80 justify-center px-6">

        <Animated.Text
          entering={FadeInDown.duration(600)}
          className="text-3xl font-bold text-center text-white mb-2">
            Welcome Back 
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(100)}
          className="text-center text-gray-400 mb-8">
          Login to Student Connect
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(200)}>
          <AuthInput
            placeholder="Email"
            placeholderTextColor="#9CA3AF" />
          <AuthInput
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#9CA3AF" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <AuthButton title="Login" />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(600)}
          className="text-center mt-6 text-gray-400"
        >
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-orange-400 font-semibold">
            Sign up
          </Link>
        </Animated.Text>

      </View>
    </ImageBackground>
  );
}
