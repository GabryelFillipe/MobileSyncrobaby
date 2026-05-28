import DateTimePicker from "@react-native-community/datetimepicker";
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
  TouchableOpacity,
  View,
} from "react-native";

import BtnPrimary from "../../../src/components/BtnPrimary";
import { InputDefault } from "../../../src/components/InputDefault";
import { useInsertChild } from "../../../src/services/hook/children/useInsertChild";

import Fem from "../../../src/assets/profileChildren/fem.svg";
import Male from "../../../src/assets/profileChildren/male.svg";

interface ChildData {
  name: string;
  birthDate: string;
  weight?: string;
  height?: string;
}

export default function AddChildPage() {
  const router = useRouter();
  const { mutate: handleRegisterAPI, isPending } = useInsertChild();

  const [photo, setPhoto] = useState<string>("");
  const [genderSelected, setGenderSelected] = useState<"male" | "female">(
    "male",
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ChildData>();

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  function handleAddChild(data: ChildData) {
    const formData = new FormData();

    formData.append("child_name", data.name);
    formData.append("birth_date", data.birthDate);
    formData.append("gender", genderSelected);
    formData.append("blood_type", "");

    if (data.weight) formData.append("weight", data.weight);
    if (data.height) formData.append("height", data.height);

    if (photo !== "") {
      const filename = photo.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("photo", {
        uri: photo,
        name: filename,
        type: type,
      } as any);
    } else {
      formData.append("photo", "");
    }

    handleRegisterAPI(formData, {
      onSuccess: () => {
        router.back();
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message || "Erro ao adicionar filho(a).";
        alert(message);
      },
    });
  }

  const toggleGender = () => {
    setGenderSelected(genderSelected === "male" ? "female" : "male");
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setValue("birthDate", formattedDate, { shouldValidate: true });
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-light"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        className="px-6"
      >
        <View className="w-full bg-lilas rounded-3xl px-6 py-8 relative mt-10 shadow-purple-md items-center">
          <View className="absolute left-6 top-6 z-10 w-14 h-14">
            <TouchableOpacity
              onPress={toggleGender}
              activeOpacity={0.8}
              className="w-full h-full items-center justify-center"
            >
              {genderSelected === "male" ? (
                <Male width={40} height={40} />
              ) : (
                <Fem width={40} height={40} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pickImage}
            className="w-36 h-36 rounded-full border-4 border-primary bg-transparent items-center justify-center mb-8 mt-4 overflow-hidden"
          >
            {photo === "" ? (
              <Text className="text-primary text-6xl font-light pb-2">+</Text>
            ) : (
              <Image
                source={{ uri: photo }}
                className="w-full h-full object-cover"
              />
            )}
          </TouchableOpacity>

          <View className="w-full gap-4">
            <View>
              <Controller
                control={control}
                name="name"
                rules={{ required: "O nome é obrigatório" }}
                render={({ field: { onChange, value } }) => (
                  <InputDefault
                    placeholder="Nome"
                    onChangeText={onChange}
                    value={value}
                    className="bg-white font-poppins text-primary-text px-4 py-3 rounded-lg"
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
                name="birthDate"
                rules={{ required: "A data de nascimento é obrigatória" }}
                render={({ field: { value } }) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowDatePicker(true)}
                    className="bg-white px-4 py-3 rounded-lg"
                  >
                    <Text
                      className={`font-poppins ${value ? "text-primary-text" : "text-gray-400"}`}
                    >
                      {value || "Data de Nascimento"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              {errors.birthDate && (
                <Text className="text-red-500 text-xs mt-1 ml-1 font-poppins">
                  {errors.birthDate.message}
                </Text>
              )}

              {showDatePicker && (
                <DateTimePicker
                  value={
                    control._formValues.birthDate
                      ? new Date(control._formValues.birthDate)
                      : new Date()
                  }
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={onDateChange}
                />
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, value } }) => (
                  <InputDefault
                    placeholder="Peso (Kg)"
                    type="number"
                    onChangeText={onChange}
                    value={value}
                    className="bg-white font-poppins text-primary-text px-4 py-3 rounded-lg"
                  />
                )}
              />
            </View>

            <View>
              <Controller
                control={control}
                name="height"
                render={({ field: { onChange, value } }) => (
                  <InputDefault
                    placeholder="Altura (cm)"
                    type="number"
                    onChangeText={onChange}
                    value={value}
                    className="bg-white font-poppins text-primary-text px-4 py-3 rounded-lg"
                  />
                )}
              />
            </View>

            <View className="flex-col gap-3 mt-4">
              <BtnPrimary
                onPress={handleSubmit(handleAddChild)}
                text={isPending ? "Adicionando..." : "Adicionar filho(a)"}
                disabled={isPending}
                className="w-full bg-accent rounded-xl py-4 h-14"
                textClassName="text-white font-bold font-poppins text-lg"
              />

              <BtnPrimary
                onPress={() => router.back()}
                text="Cancelar"
                disabled={isPending}
                className="w-full bg-white rounded-xl py-4 h-14 border border-gray-100"
                textClassName="text-primary-text font-bold font-poppins text-lg"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
