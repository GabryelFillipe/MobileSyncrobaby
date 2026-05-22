import Constants from "expo-constants";
import { Redirect, useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../src/assets/icons/logoIcon.svg";
import { useAuth } from "../src/context/AuthContext";

const statusBarHeight = Constants.statusBarHeight;

export default function ScreenWelcome() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/home" />;
  }

  return (
    <ScrollView
      className="flex-1 bg-red-900"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View
        className="bg-white flex-1 w-full flex-col justify-between pb-10"
        style={{ paddingTop: statusBarHeight }}
      >
        <View className="bg-lilas w-full h-1/3 relative px-4">
          <View className="w-full flex-col mt-4 ">
            <View className="bg-primary w-full flex items-center justify-center rounded-xl left-0 mb-10 shadow-purple-sm absolute top-6 py-10">
              <Logo width={200} height={200} />
            </View>
          </View>
        </View>

        <View className="flex flex-col gap-4 mt-25 px-4">
          <Text className="text-darker-purple font-bold text-5xl uppercase">
            bem-vindo!
          </Text>
          <Text className="text-darker-purple text-xl">
            Conectando você a cada pequeno momento.
          </Text>
        </View>

        <View className="flex-col gap-4 w-full mt-auto px-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-lilas border border-transparent w-full items-center h-14 justify-center rounded-xl"
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text className="text-primary-text font-bold text-2xl">Entre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-accent w-full items-center h-14 justify-center rounded-xl"
          >
            <Text className="text-white font-bold text-2xl">Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
