import { Slot } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { AuthHeader } from "../../src/components/auth/AuthHeader";

export default function AuthLayout() {
  return (
    <KeyboardAvoidingView
      className="flex-1 w-full bg-light"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <AuthHeader />

        <View className="flex-1 w-full items-center px-4 -mt-12 pb-10">
          <Slot />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
