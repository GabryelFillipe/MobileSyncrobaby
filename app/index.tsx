import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 h-screen w-full  bg-white">
      <View>
        <Text className="text-2xl w-full   bg-red-600 font-bold flex items-center justify-center">
          Bem-vindo!
        </Text>
        <Link href="/home" className="mt-4 text-2xl text-blue-500">
          Ir para o home
        </Link>
        <Link href="/addProfessional" className="mt-4 text-2xl text-green-500">
          Ir para o addProfessional
        </Link>
      </View>
    </SafeAreaView>
  );
}
