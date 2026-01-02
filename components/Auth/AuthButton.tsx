import { TouchableOpacity, Text } from "react-native";

export default function AuthButton({ title }: { title: string }) {
  return (
    <TouchableOpacity className="bg-orange-500 py-4 rounded-xl active:opacity-90">
      <Text className="text-center text-black font-bold text-lg">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
