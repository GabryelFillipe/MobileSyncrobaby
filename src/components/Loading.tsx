import LottieView from "lottie-react-native";
import React from "react";
import { Text, View } from "react-native";
import babyCrawlingAnimation from "../../src/assets/icons/baby_crawling.json";

interface LoadingBabyProps {
  message?: string;
}

export function LoadingBaby({ message = "Carregando..." }: LoadingBabyProps) {
  return (
    <View className="w-full flex flex-col items-center justify-center py-12 gap-4">
      <View className="w-48 h-48 md:w-64 md:h-64">
        <LottieView
          source={babyCrawlingAnimation}
          autoPlay
          loop
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <Text className="text-primary font-nunito font-semibold text-lg text-center animate-pulse">
        {message}
      </Text>
    </View>
  );
}
