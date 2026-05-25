import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CloudPurple from "../../../src/assets/icons/cloudPurple.svg";
import BtnPrimary from "../../../src/components/BtnPrimary";
import type { Register } from "../../../src/components/diary/Card";
import { InputDefault } from "../../../src/components/InputDefault";
import { useInsertDiary } from "../../../src/services/hook/diary/useInsertDiary";
import DateUtils from "../../../src/utils/Date";
import { colors } from "./[id]";

const labelClass =
  "font-poppins text-primary-darker font-semibold text-[14px] mb-1 mt-4";
const inputClass =
  "font-poppins text-primary text-[16px] border border-primary-darker rounded-sm w-full h-12 pl-3";

export default function NewAnotation() {
  const router = useRouter();
  const insertMutation = useInsertDiary();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Register>({
    defaultValues: {
      title: "",
      text_content: "",
      creation_date: DateUtils.getTodayFormated(),
    },
  });

  const [colorLabel, setColorLabel] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPreview(result.assets[0].uri);
    }
  }

  function sendData(data: Register) {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("content", data.text_content || "");
    formData.append("date", data.creation_date);
    formData.append("color", colorLabel);
    formData.append("fk_id_child", "1");

    if (preview && preview !== "null") {
      const filename = preview.split("/").pop() || "media.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("media", {
        uri: preview,
        name: filename,
        type: type,
      } as any);
    }

    insertMutation.mutate(formData as any);
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 w-full bg-light relative z-100"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 10,
          paddingInline: 12,
        }}
        className="relative z-100"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col relative z-100 items-center w-full bg-white rounded-md shadow-purple-sm pb-0">
          <View className="flex-col items-center bg-[#f4ebfb] w-full rounded-t-md py-4">
            <View className="flex justify-center items-center w-8 h-8 rounded-full shadow-purple-md mb-2 bg-white">
              <CloudPurple width={20} height={20} />
            </View>
            <Text className="font-poppins text-darker-purple font-semibold text-xl">
              Nova Lembrança
            </Text>
            <Text className="font-nunito text-gray-dark text-center px-2">
              Guarde os momentos mais preciosos do seu bebê
            </Text>
          </View>

          <View className="flex-col w-full px-4 mt-2">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={pickImage}
              className="flex-col justify-center items-center w-full h-40 border-2 border-dashed border-accent rounded-2xl overflow-hidden bg-gray-50"
            >
              {preview ? (
                <Image
                  source={{ uri: preview }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <>
                  <Text className="text-darker-purple font-poppins font-semibold mt-2 text-center">
                    Toque para escolher uma foto
                  </Text>
                  <Text className="text-gray-medium text-sm mt-1">
                    Suporta JPG ou PNG
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text className={labelClass}>Título da Lembrança</Text>
            <Controller
              control={control}
              name="title"
              rules={{ required: "Campo obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <InputDefault
                  onChangeText={onChange}
                  value={value || ""}
                  maxLength={120}
                  className={inputClass}
                />
              )}
            />
            {errors.title && (
              <Text className="text-red-600/70 text-sm font-nunito mt-1">
                {errors.title.message}
              </Text>
            )}

            <View className="flex-row justify-between w-full mt-0">
              <View className="flex-col flex-1 mr-4">
                <Text className={labelClass}>Etiqueta</Text>
                <View className="flex-row flex-wrap gap-1 mt-1">
                  {colors.map((color) => (
                    <TouchableOpacity
                      key={color.color}
                      onPress={() => setColorLabel(color.color)}
                      style={{ backgroundColor: color.color }}
                      className={`w-8 h-8 rounded-full ${colorLabel === color.color ? "border-2 border-accent" : ""}`}
                    />
                  ))}
                </View>
              </View>

              <View className="flex-col flex-1">
                <Text className={labelClass}>Data</Text>
                <Controller
                  control={control}
                  name="creation_date"
                  render={({ field: { onChange, value } }) => (
                    <InputDefault
                      onChangeText={onChange}
                      value={value || ""}
                      placeholder="YYYY-MM-DD"
                      className={inputClass}
                    />
                  )}
                />
                {errors.creation_date && (
                  <Text className="text-red-600/70 text-sm font-nunito mt-0">
                    {errors.creation_date.message}
                  </Text>
                )}
              </View>
            </View>

            <Text className={labelClass}>Descrição</Text>
            <Controller
              control={control}
              name="text_content"
              rules={{ required: "Campo obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value || ""}
                  maxLength={760}
                  multiline={true}
                  numberOfLines={5}
                  textAlignVertical="top"
                  className="font-poppins text-primary text-[16px] border border-primary-darker rounded-sm w-full min-h-[120px] p-3"
                />
              )}
            />
            {errors.text_content && (
              <Text className="text-red-600/70 text-sm font-nunito mt-1">
                {errors.text_content.message}
              </Text>
            )}

            {insertMutation.isError && (
              <Text className="text-red-600 text-center font-semibold mt-4">
                {insertMutation.error?.message}
              </Text>
            )}

            <View className="flex-row justify-between items-center w-full mt-4 mb-4">
              <BtnPrimary
                onPress={() => router.back()}
                text="Cancelar"
                className="w-[45%] h-10 bg-white border border-gray-300"
                textClassName="text-dark-purple"
              />
              <BtnPrimary
                onPress={handleSubmit(sendData)}
                text={insertMutation.isPending ? "Salvando..." : "Registrar"}
                className="w-[45%] h-10 bg-accent"
                textClassName="text-white font-semibold"
                disabled={insertMutation.isPending}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
