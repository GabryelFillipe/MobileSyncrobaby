import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Teste() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Bem-vindo!</Text>

      {/* Navega para app/login.tsx */}
      <Link href="/" className="mt-4 text-blue-500">
        Ir para o Login
      </Link>
    </View>
  );
}
