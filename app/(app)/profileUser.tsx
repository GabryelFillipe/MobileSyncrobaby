import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { InputDefault } from "../../src/components/InputDefault";
import { inputClassName, labelClassName } from "../../src/style/globalStyles";

import CameraIcon from "../../src/assets/icons/cameraIcon.svg";
import LogoutIcon from "../../src/assets/icons/logoutIcon.svg";

interface UserData {
  name: string;
  email: string;
  password?: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    defaultValues: {
      name: "Nome Usuário",
      email: "email@teste.com",
    },
  });

  function handleSave(data: UserData) {
    console.log("Dados prontos para salvar:", data);
    setIsEditing(false);
  }

  function handlePickImage() {
    if (!isEditing) return;
    console.log("Abrir seletor de imagens nativo");
  }

  return (
    <ScrollView
      className="flex-1 bg-light font-nunito"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 flex-col items-center justify-center w-full py-8 xl:py-0">
        <View className="w-[90%] bg-lilas rounded-3xl px-6 py-8 relative mx-auto shadow-purple-md">
          <TouchableOpacity
            className="absolute top-4 right-4 z-10"
            onPress={() => router.replace("/")}
          >
            <LogoutIcon width={24} height={24} />
          </TouchableOpacity>

          <View className="flex justify-center items-center mb-6">
            <TouchableOpacity
              activeOpacity={isEditing ? 0.7 : 1}
              onPress={handlePickImage}
              className="w-32 h-32 rounded-full border-2 border-purple-300 bg-white items-center justify-center overflow-hidden"
            >
              {preview && preview !== "null" ? (
                <Image
                  source={{ uri: preview }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <CameraIcon width={40} height={40} opacity={0.6} />
              )}
            </TouchableOpacity>
          </View>

          <View className="flex flex-col w-full gap-4">
            <View className="flex flex-col">
              <Text className={labelClassName}>Nome</Text>
              <Controller
                control={control}
                name="name"
                rules={{ required: "O nome é obrigatório" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputDefault
                    placeholder="Seu nome"
                    className={`${inputClassName} bg-white rounded-xl`}
                    editable={isEditing}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.name && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </Text>
              )}
            </View>

            <View className="flex flex-col">
              <Text className={labelClassName}>E-mail</Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "O e-mail é obrigatório",
                  pattern: { value: /^\S+@\S+$/i, message: "E-mail inválido" },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputDefault
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="seuemail@exemplo.com"
                    className={`${inputClassName} bg-white rounded-xl`}
                    editable={isEditing}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </Text>
              )}
            </View>

            <View className="flex flex-col">
              <Text className={labelClassName}>Senha</Text>
              <Controller
                control={control}
                name="password"
                rules={{ required: "A senha é obrigatória" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputDefault
                    secureTextEntry
                    placeholder="***********"
                    className={`${inputClassName} bg-white rounded-xl`}
                    editable={isEditing}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            <View className="flex flex-col gap-3 mt-6">
              {isEditing ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="w-full bg-accent text-white rounded-xl py-4 items-center shadow-sm"
                  onPress={() => setIsEditing(true)}
                >
                  <Text className="text-white font-poppins font-bold">
                    Salvar Perfil
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="w-full bg-accent text-white rounded-xl py-4 shadow-sm items-center"
                  onPress={() => setIsEditing(true)}
                >
                  <Text className="text-white font-poppins font-bold">
                    Editar Perfil
                  </Text>
                </TouchableOpacity>
              )}

              {isEditing ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="w-full bg-white border  border-purple-200 rounded-xl py-4 items-center shadow-sm"
                  onPress={() => setIsEditing(false)}
                >
                  <Text className="text-accent font-poppins font-bold">
                    Cancelar
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="w-full bg-white border  border-purple-200 rounded-xl py-4 items-center shadow-sm"
                  onPress={() => console.log("Excluir conta acionado")}
                >
                  <Text className="text-accent font-poppins font-bold">
                    Excluir Perfil
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
