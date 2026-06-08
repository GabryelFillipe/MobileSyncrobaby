import { useQueryClient } from "@tanstack/react-query"; // <- Importado o QueryClient
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { InputDefault } from "../../src/components/InputDefault";
import { LoadingBaby } from "../../src/components/Loading";
import { useAuth } from "../../src/context/AuthContext";
import { useGetChildDeactivate } from "../../src/services/hook/children/useGetChildDeactivate";
import { useReactivateChild } from "../../src/services/hook/children/useReactivateChild";
import {
  useUpdateProfilePicture,
  useUpdateUser,
} from "../../src/services/hook/user/useUpdateUser";
import { inputClassName } from "../../src/style/globalStyles";

import dateUtils from "../../src/utils/Date";

import CameraIcon from "../../src/assets/icons/cameraIcon.svg";
import ChildIcon from "../../src/assets/icons/childIcon.svg";
import Close from "../../src/assets/icons/closeModal.svg";
import LogoutIcon from "../../src/assets/icons/logoutIcon.svg";
import SearchIcon from "../../src/assets/icons/search.svg";

interface UserData {
  name: string;
  email: string;
  password?: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const { logout, user, updateUserContext } = useAuth();

  const queryClient = useQueryClient(); // <- Instanciado o QueryClient

  const { mutateAsync: updateProfileText } = useUpdateUser();
  const { mutateAsync: updateProfilePic } = useUpdateProfilePicture();

  const {
    data: inactiveChildren,
    isLoading: loadingInactive,
    refetch: refetchInactiveChildren,
  } = useGetChildDeactivate();

  const { mutateAsync: reactivateChild } = useReactivateChild();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // <- Estado para ocultar instantaneamente o filho reativado da lista local
  const [hiddenChildIds, setHiddenChildIds] = useState<number[]>([]);

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

  const safeInactiveChildren = inactiveChildren as any;
  const allInactiveChildren: any[] = Array.isArray(safeInactiveChildren)
    ? safeInactiveChildren.flatMap((response: any) => response.children || [])
    : safeInactiveChildren?.children || [];

  const filteredChildren = allInactiveChildren.filter(
    (child: any) =>
      child?.child_name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !hiddenChildIds.includes(child.id_child), // <- Filtra garantindo que os reativados não apareçam
  );

  if (!user) return <LoadingBaby message="Carregando perfil..." />;

  return (
    <>
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

          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 mt-8"
            onPress={() => setIsModalVisible(true)}
          >
            <ChildIcon width={24} height={24} />
            <Text className="font-poppins font-bold text-primary-text underline text-base">
              Filhos desativados
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <BlurView
            intensity={40}
            tint="dark"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <View className="w-[90%] max-h-[80%] bg-light rounded-3xl p-6 shadow-lg">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-2xl font-bold font-poppins text-[#1E293B]">
                  Perfis inativos
                </Text>
                <Text className="text-sm text-gray-500 font-poppins mt-1">
                  Selecione um perfil para reativar ou editar.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="p-1"
              >
                <Close width={24} height={24} color="#41354C" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center bg-white shadow-purple-md rounded-xl px-4 py-1 mb-6">
              <SearchIcon width={20} height={20} color="#9CA3AF" />
              <TextInput
                placeholder="Pesquisar perfil..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 font-poppins text-gray-700"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {loadingInactive ? (
              <LoadingBaby message="Carregando perfis inativos..." />
            ) : (
              <FlatList
                data={filteredChildren}
                keyExtractor={(item, index) =>
                  item.id_child?.toString() || index.toString()
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
                ListEmptyComponent={
                  <Text className="text-center text-primary-text font-poppins py-4">
                    Nenhum perfil inativo encontrado.
                  </Text>
                }
                renderItem={({ item }) => (
                  <View className="flex-row items-center justify-between bg-white border border-primary-dark rounded-2xl p-4 shadow-sm">
                    <View className="flex-row items-center gap-4">
                      <View className="w-12 h-12 rounded-full bg-light items-center justify-center">
                        <Image
                          source={{
                            uri:
                              item.photo || "https://via.placeholder.com/150",
                          }}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </View>
                      <View>
                        <Text className="text-primary font-bold font-poppins text-lg">
                          {item.child_name}
                        </Text>
                        <Text className="text-primary font-poppins text-sm">
                          {item.birth_date
                            ? `Nasc: ${dateUtils.formatedDate(item.birth_date)}`
                            : "Data não inf."}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      className="bg-accent px-4 py-2 rounded-xl"
                      onPress={async () => {
                        try {
                          await reactivateChild(item.id_child);

                          setHiddenChildIds((prev) => [...prev, item.id_child]);

                          await queryClient.invalidateQueries({
                            queryKey: ["childDeactivate"],
                          });

                          await refetchInactiveChildren();
                          setIsModalVisible(false);

                          Alert.alert(
                            "Sucesso",
                            `O perfil de ${item.child_name} foi reativado!`,
                          );
                        } catch (error) {
                          Alert.alert(
                            `${error instanceof Error ? error.message : "Erro desconhecido"}`,
                            "Não foi possível reativar o perfil.",
                          );
                        }
                      }}
                    >
                      <Text className="text-white font-bold font-poppins">
                        Reativar
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
