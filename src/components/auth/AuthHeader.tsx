import { usePathname, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import BackIcon from "../../assets/icons/BackIcon.svg";
import LogoAside from "../../assets/icons/logoIcon.svg";

export function AuthHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginScreen = pathname === "/login";

  return (
    <View className="bg-primary pt-10 pb-10 px-6 w-full relative items-center justify-center">
      {!isLoginScreen && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="absolute top-0 left-4 p-2 z-100"
        >
          <BackIcon width={32} height={32} color="#2D114C" />
        </TouchableOpacity>
      )}

      <View className="w-full flex-row items-center justify-center gap-4 mt-4">
        <LogoAside width={200} height={250} />
        <View className="flex-col justify-center"></View>
      </View>
    </View>
  );
}
