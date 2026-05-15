import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View>
      <Text className="text-2xl font-bold">Bem-vindo!</Text>
      {/* Navega para app/login.tsx */}
      <Link href="/teste" className="mt-4 text-blue-500">
        Ir para o Login
      </Link>{" "}
    </View>
  );
}
