import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SetBack from "../../../src/assets/navigation/setBack.svg";
import Trash from "../../../src/assets/routines/trashPurple.svg";
import BtnPrimary from "../../../src/components/BtnPrimary";
import { EmptyState } from "../../../src/components/EmptyState";
import type { Diary as DiaryType } from "../../../src/services/diary/diary.service";
import { useDeleteDiary } from "../../../src/services/hook/diary/useDeleteDiary";
import { useGetDiary } from "../../../src/services/hook/diary/useGetDiary";
import { useUpdateDiary } from "../../../src/services/hook/diary/useUpdateDiary";
import DateUtils from "../../../src/utils/Date";

export interface Color {
  color: string;
}

export const colors: Color[] = [
  { color: "#FFA9DD" },
  { color: "#68DBCE" },
  { color: "#F3DC82" },
  { color: "#FF9193" },
];

export default function AnotationDetails() {
  const router = useRouter();
  const { id, edit } = useLocalSearchParams<{ id: string; edit?: string }>();
  const isEditing = edit === "true";
  const childSelected = 1;

  const { data, isLoading, isError, error } = useGetDiary(childSelected);
  const updateMutation = useUpdateDiary();
  const deleteMutation = useDeleteDiary();

  const [colorSelected, setColorSelected] = useState<string>("");
  const [previewImg, setPreviewImg] = useState<string | undefined>(undefined);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DiaryType>();

  const diaryList = data && typeof data !== "string" ? data.diary : [];
  const currentAnotation = diaryList.find(
    (it) => it.id_diary_note === Number(id),
  );

  useEffect(() => {
    if (currentAnotation) {
      reset({
        id_diary_note: currentAnotation.id_diary_note,
        title: currentAnotation.title,
        content: currentAnotation.content,
        date: currentAnotation.date.split("T")[0],
        color: currentAnotation.color,
        media: currentAnotation.media,
        fk_id_child: currentAnotation.fk_id_child,
      });
      setColorSelected(currentAnotation.color);
      setPreviewImg(currentAnotation.media);
    }
  }, [currentAnotation, reset]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-light">
        <ActivityIndicator size="large" color="#9D87D2" />
      </View>
    );
  }

  if (isError || !currentAnotation) {
    return (
      <EmptyState
        isFullPage={true}
        show404Background={true}
        title="Ops! Registro não encontrado."
        description={
          error?.message || "Não conseguimos carregar este registro do diário."
        }
        buttonText="Voltar"
        onButtonClick={() => router.back()}
      />
    );
  }

  async function pickImage() {
    if (!isEditing) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPreviewImg(result.assets[0].uri);
    }
  }

  function sendData(formData: DiaryType) {
    updateMutation.mutate({
      id_diary_note: formData.id_diary_note,
      title: formData.title,
      content: formData.content,
      date: formData.date,
      color: colorSelected,
      media: previewImg || "",
      fk_id_child: formData.fk_id_child,
    });
  }

  function handleDelete() {
    deleteMutation.mutate(Number(id));
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 w-full bg-light"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 w-full px-4 pt-4 text-primary-text">
          <View className="flex-row justify-between items-center w-full mb-4">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <SetBack width={24} height={24} />
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity
                onPress={handleDelete}
                activeOpacity={0.7}
                className="p-2"
              >
                <Trash width={20} height={20} />
              </TouchableOpacity>
            )}
          </View>

          <View className="w-full mb-4">
            <Controller
              control={control}
              name="title"
              rules={{ required: "Título inválido!" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  editable={isEditing}
                  textAlign="center"
                  className={`w-full font-poppins font-bold text-xl py-2 ${
                    isEditing ? "border-2 border-primary rounded-sm" : ""
                  }`}
                />
              )}
            />
            {errors.title && (
              <Text className="text-center text-red-600/70 text-sm font-nunito mt-1">
                {errors.title.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={isEditing ? 0.8 : 1}
            onPress={pickImage}
            className="w-full h-56 mb-4 rounded-md overflow-hidden relative justify-center items-center bg-gray-200"
          >
            {previewImg ? (
              <Image
                source={{ uri: previewImg }}
                className={`w-full h-full object-cover ${isEditing ? "opacity-70" : ""}`}
              />
            ) : (
              <Text className="font-poppins text-gray-500">Sem imagem</Text>
            )}
            {isEditing && (
              <View className="absolute bg-black/40 px-4 py-2 rounded-md">
                <Text className="text-white font-semibold text-lg">
                  Alterar Imagem
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-between items-center w-full mb-4">
            <View className="flex-1">
              <Controller
                control={control}
                name="date"
                rules={{ required: "Data inválida!" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    value={value}
                    editable={isEditing}
                    className={`font-nunito text-primary italic font-semibold h-10 ${
                      isEditing
                        ? "border-2 border-primary rounded-sm w-32 text-center"
                        : ""
                    }`}
                  />
                )}
              />
              {errors.date && (
                <Text className="text-red-600/70 text-sm font-nunito">
                  {errors.date.message}
                </Text>
              )}
            </View>
            <Text className="font-nunito text-primary italic">
              {DateUtils.subDaysFormated(currentAnotation.date)}
            </Text>
          </View>

          <View className="flex-1 w-full min-h-37">
            <Controller
              control={control}
              name="content"
              rules={{ required: "Descrição inválida!" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  editable={isEditing}
                  multiline
                  textAlignVertical="top"
                  className={`w-full flex-1 font-nunito text-justify text-[16px] ${
                    isEditing ? "rounded-sm border-2 border-primary p-3" : ""
                  }`}
                />
              )}
            />
            {errors.content && (
              <Text className="text-red-600/70 text-sm font-nunito mt-1">
                {errors.content.message}
              </Text>
            )}
          </View>

          {(updateMutation.isError || deleteMutation.isError) && (
            <Text className="text-red-600 text-center font-semibold mt-4">
              {updateMutation.error?.message || deleteMutation.error?.message}
            </Text>
          )}

          {isEditing && (
            <View className="w-full mt-8 border-t border-gray-200 pt-4">
              <View className="flex-row justify-end mb-6 gap-2">
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color.color}
                    onPress={() => setColorSelected(color.color)}
                    style={{ backgroundColor: color.color }}
                    className={`w-10 h-10 rounded-full ${colorSelected === color.color ? "border-2 border-accent" : ""}`}
                  />
                ))}
              </View>

              <View className="flex-row justify-between items-center w-full">
                <BtnPrimary
                  onPress={() => router.back()}
                  text="Cancelar"
                  className="w-[45%] h-12 bg-lilas"
                  textClassName="text-primary-text font-semibold"
                />
                <BtnPrimary
                  onPress={handleSubmit(sendData)}
                  text={updateMutation.isPending ? "Salvando..." : "Salvar"}
                  className="w-[45%] h-12 bg-accent"
                  textClassName="text-white font-semibold"
                  disabled={updateMutation.isPending}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
