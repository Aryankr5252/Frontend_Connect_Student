import { TextInput } from "react-native";

export default function AuthInput(props: any) {
  return (
    <TextInput
      {...props}
      className="bg-zinc-900 text-white px-4 py-4 rounded-xl mb-4 border border-zinc-700 focus:border-orange-400"
    />
  );
}
