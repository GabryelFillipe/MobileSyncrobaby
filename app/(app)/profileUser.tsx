import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { InputDefault } from "../../src/components/InputDefault";
import { LoadingBaby } from "../../src/components/Loading";
import { useAuth } from "../../src/context/AuthContext";
import { inputClassName } from "../../src/style/globalStyles";

import CameraIcon from "../../src/assets/icons/cameraIcon.svg";
import LogoutIcon from "../../src/assets/icons/logoutIcon.svg";

interface UserData {
  name: string;
  email: string;
  password?: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  async function handleLogout() {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  }

  async function handleSave(data: UserData) {
    setLoading(true);
    try {
      console.log("Dados enviados para API:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simula delay
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <LoadingBaby message="Carregando perfil..." />;

  return (
    <ScrollView
      className="flex-1 bg-light font-nunito"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 flex-col items-center justify-center w-full py-8">
        <View className="w-[90%] bg-lilas rounded-3xl px-6 py-8 relative shadow-purple-md">
          <TouchableOpacity
            className="absolute top-4 right-4 z-10"
            onPress={handleLogout}
          >
            <LogoutIcon width={24} height={24} />
          </TouchableOpacity>

          <View className="flex justify-center items-center mb-6">
            <View className="w-32 h-32 rounded-full border-2 border-purple-300 bg-white items-center justify-center overflow-hidden">
              <CameraIcon width={40} height={40} opacity={0.6} />
            </View>
          </View>

          <View className="flex flex-col w-full gap-4">
            <Controller
              control={control}
              name="name"
              rules={{ required: "O nome é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <InputDefault
                  placeholder="Nome"
                  editable={isEditing}
                  onChangeText={onChange}
                  value={value}
                  className={`${inputClassName} bg-white rounded-xl`}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{ required: "O e-mail é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <InputDefault
                  placeholder="E-mail"
                  editable={isEditing}
                  onChangeText={onChange}
                  value={value}
                  className={`${inputClassName} bg-white rounded-xl`}
                />
              )}
            />

            <View className="flex flex-col gap-3 mt-6">
              <TouchableOpacity
                className="w-full bg-accent rounded-xl py-4 items-center"
                onPress={
                  isEditing
                    ? handleSubmit(handleSave)
                    : () => setIsEditing(true)
                }
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text className="text-white font-poppins font-bold">
                    {isEditing ? "Salvar Perfil" : "Editar Perfil"}
                  </Text>
                )}
              </TouchableOpacity>

              {isEditing && (
                <TouchableOpacity
                  className="w-full bg-white border border-purple-200 rounded-xl py-4 items-center"
                  onPress={() => setIsEditing(false)}
                >
                  <Text className="text-accent font-poppins font-bold">
                    Cancelar
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
