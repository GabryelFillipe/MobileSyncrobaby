import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { InputDefault } from "../../src/components/InputDefault";
import { LoadingBaby } from "../../src/components/Loading";
import { useAuth } from "../../src/context/AuthContext";
import {
  useUpdateProfilePicture,
  useUpdateUser,
} from "../../src/services/hook/user/useUpdateUser";
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
  const { logout, user, updateUserContext } = useAuth();

  const { mutateAsync: updateProfileText } = useUpdateUser();
  const { mutateAsync: updateProfilePic } = useUpdateProfilePicture();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
      if (user.photo) {
        setPreview(user.photo);
      }
    }
  }, [user, reset]);

  async function handleLogout() {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      Alert.alert("Erro", `Não foi possível sair da conta. ${error}`);
    }
  }

  async function pickImage() {
    if (!isEditing) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPreview(result.assets[0].uri);
    }
  }

  async function handleSave(data: UserData) {
    setLoading(true);
    try {
      let updatedName = user?.name || "";
      let updatedEmail = user?.email || "";
      let updatedPhoto = user?.photo || "";

      if (data.name !== user?.name || data.email !== user?.email) {
        const textResponse = await updateProfileText({
          guardian_name: data.name,
          email: data.email,
        });
        updatedName = textResponse.user.guardian_name;
        updatedEmail = textResponse.user.email;
      }

      if (preview && preview !== user?.photo) {
        const formData = new FormData();
        const filename = preview.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("profile_picture", {
          uri: preview,
          name: filename,
          type: type,
        } as any);

        await updateProfilePic(formData);
        updatedPhoto = preview;
      }

      if (data.password) {
        console.log(
          "Fluxo de alteração de senha invocado para:",
          data.password,
        );
      }

      if (user) {
        await updateUserContext({
          ...user,
          name: updatedName,
          email: updatedEmail,
          photo: updatedPhoto,
        });
      }

      setIsEditing(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Excluir Perfil",
      "Tem certeza que deseja excluir sua conta permanentemente? Você perderá todos os dados salvos.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            Alert.alert("Aviso", "Lógica de exclusão de conta.");
          },
        },
      ],
    );
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
            <TouchableOpacity
              activeOpacity={isEditing ? 0.8 : 1}
              onPress={pickImage}
              className="w-32 h-32 rounded-full border-2 border-purple-300 bg-white items-center justify-center overflow-hidden"
            >
              {preview ? (
                <Image
                  source={{ uri: preview }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <CameraIcon width={40} height={40} opacity={0.6} />
              )}
            </TouchableOpacity>
          </View>

          <View className="flex flex-col w-full gap-4">
            <View>
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
              {errors.name && (
                <Text className="text-red-500 text-xs mt-1 ml-1 font-poppins">
                  {errors.name.message}
                </Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="email"
                rules={{ required: "O e-mail é obrigatório" }}
                render={({ field: { onChange, value } }) => (
                  <InputDefault
                    placeholder="E-mail"
                    type="email"
                    editable={isEditing}
                    onChangeText={onChange}
                    value={value}
                    className={`${inputClassName} bg-white rounded-xl`}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1 ml-1 font-poppins">
                  {errors.email.message}
                </Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <InputDefault
                    placeholder={
                      isEditing ? "Nova senha (Opcional)" : "••••••••"
                    }
                    type="password"
                    editable={isEditing}
                    onChangeText={onChange}
                    value={value}
                    className={`${inputClassName} bg-white rounded-xl`}
                  />
                )}
              />
            </View>

            <View className="flex flex-col gap-3 mt-6">
              <TouchableOpacity
                className="w-full bg-accent rounded-xl py-4 items-center"
                onPress={
                  isEditing
                    ? handleSubmit(handleSave)
                    : () => setIsEditing(true)
                }
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text className="text-white font-poppins font-bold">
                    {isEditing ? "Salvar Perfil" : "Editar Perfil"}
                  </Text>
                )}
              </TouchableOpacity>

              {isEditing ? (
                <TouchableOpacity
                  className="w-full bg-white border border-purple-200 rounded-xl py-4 items-center"
                  onPress={() => {
                    setIsEditing(false);
                    if (user) {
                      reset({
                        name: user.name || "",
                        email: user.email || "",
                        password: "",
                      });
                      setPreview(user.photo || null);
                    }
                  }}
                  disabled={loading}
                >
                  <Text className="text-accent font-poppins font-bold">
                    Cancelar
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="w-full bg-white border border-red-200 rounded-xl py-4 items-center"
                  onPress={handleDeleteAccount}
                >
                  <Text className="text-red-500 font-poppins font-bold">
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
