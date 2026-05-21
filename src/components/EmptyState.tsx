import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import Erro404Icon from "../assets/icons/404.svg";
import BabySad from "../assets/images/baby_sad.png";

export interface EmptyStateProps {
  title: React.ReactNode;
  description: React.ReactNode;
  buttonText: string;
  onButtonClick: () => void;
  show404Background?: boolean;
  isFullPage?: boolean;
}

export function EmptyState({
  title,
  description,
  buttonText,
  onButtonClick,
  show404Background = false,
  isFullPage = false,
}: EmptyStateProps) {
  if (isFullPage) {
    return (
      <View className="flex-1 bg-light pt-12 items-center justify-center">
        <View className="relative flex justify-center items-center w-full h-1/2 px-4">
          {show404Background && (
            <View className="absolute z-0 w-full h-full items-center justify-center opacity-40">
              <Erro404Icon width={300} height={300} />
            </View>
          )}
          <Image
            source={BabySad}
            alt="Bebê triste"
            resizeMode="contain"
            className="absolute bottom-4 w-[80%] h-[80%] z-10"
          />
        </View>

        <View className="flex flex-col items-center justify-evenly h-1/2 w-full pb-10">
          <View className="flex flex-col items-center w-full gap-4 px-6">
            <Text className="text-darker-purple font-poppins font-bold text-3xl md:text-5xl text-center">
              {title}
            </Text>
            <Text className="text-primary font-nunito font-semibold text-lg md:text-2xl text-center italic">
              {description}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onButtonClick}
            className="flex justify-center items-center w-64 h-14 bg-accent rounded-lg shadow-purple-sm mt-8"
          >
            <Text className="text-white font-poppins font-semibold text-xl">
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="w-full flex flex-col items-center justify-center py-12 gap-6">
      <View className="relative flex justify-center items-center w-full max-w-50 aspect-square">
        {show404Background && (
          <View className="absolute z-0 w-[150%] items-center justify-center opacity-40">
            <Erro404Icon width={200} height={200} />
          </View>
        )}
        <Image
          source={BabySad}
          alt="Bebê triste"
          resizeMode="contain"
          className="w-full h-full z-10"
        />
      </View>

      <View className="flex flex-col items-center gap-2 w-full px-4">
        <Text className="text-darker-purple font-poppins font-bold text-2xl text-center">
          {title}
        </Text>
        <Text className="text-primary font-nunito font-semibold text-base text-center italic">
          {description}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onButtonClick}
        className="flex justify-center items-center w-60 h-12 bg-accent rounded-lg shadow-purple-sm mt-4"
      >
        <Text className="text-white font-poppins font-semibold text-lg">
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
