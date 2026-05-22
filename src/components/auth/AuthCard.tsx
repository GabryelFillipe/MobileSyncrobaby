import type { ReactNode } from "react";
import React from "react";
import { Text, View } from "react-native";

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <View className="bg-lilas z-10 w-full max-w-113 rounded-4xl shadow-purple-md flex flex-col px-6 py-10 md:px-12 md:py-16">
      <Text className="text-3xl md:text-5xl font-bold font-poppins text-darker-purple mb-8 text-left">
        {title}
      </Text>
      <View className="flex flex-col gap-6 w-full">{children}</View>
    </View>
  );
}
