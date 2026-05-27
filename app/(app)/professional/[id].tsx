import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SetSelectorIcon from "../../../src/assets/icons/setExpandSelector.svg";
import BtnPrimary from "../../../src/components/BtnPrimary";
import { InputDefault } from "../../../src/components/InputDefault";
import {
  inputClassName,
  labelClassName,
  labelRadioButton,
} from "../../../src/style/globalStyles";

import { useUpdateProfessional } from "../../../src/services/hook/professional/updateProfessional";
import { useGetSpecialties } from "../../../src/services/hook/specialty/getSpecialty";

interface PediatricianData {
  name: string;
  profession: string;
  address: string;
  last_appointment_date: string;
  phone: string;
  description?: string;
}

export default function EditProfessional() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialProfessional = useMemo(() => {
    const rawData = typeof params.data === "string" ? params.data : null;
    return rawData ? JSON.parse(rawData) : null;
  }, [params.data]);

  const { data: specialtiesResponse, isLoading: isLoadingSpecialties } =
    useGetSpecialties();
  const specialties = specialtiesResponse?.specialty || [];

  const { mutateAsync: updateProfessional, isPending } =
    useUpdateProfessional();

  const [childId, setChildId] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [professionExpand, setProfessionExpand] = useState<boolean>(false);
  const [professionLabel, setProfessionLabel] = useState<string>(
    "Carregando profissão...",
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PediatricianData>({
    defaultValues: {
      name: initialProfessional?.professional_name || "",
      profession: "",
      address: initialProfessional?.address || "",
      phone: initialProfessional?.phone || "",
      last_appointment_date: initialProfessional?.last_consultation
        ? initialProfessional.last_consultation.split("T")[0]
        : "",
      description: initialProfessional?.description || "",
    },
  });

  useEffect(() => {
    async function loadChildId() {
      const storedId = await AsyncStorage.getItem("select_child");
      if (storedId) {
        setChildId(Number(storedId));
      }
    }
    loadChildId();
  }, []);

  useEffect(() => {
    if (specialties.length > 0 && initialProfessional) {
      const foundSpec = specialties.find(
        (s) =>
          Number(s.id_specialization) ===
          Number(initialProfessional.fk_id_specialization),
      );

      if (foundSpec) {
        setProfessionLabel(foundSpec.specialization_name);

        reset({
          name: initialProfessional.professional_name || "",
          profession: foundSpec.specialization_name,
          address: initialProfessional.address || "",
          phone: initialProfessional.phone || "",
          last_appointment_date: initialProfessional.last_consultation
            ? initialProfessional.last_consultation.split("T")[0]
            : "",
          description: initialProfessional.description || "",
        });
      } else {
        setProfessionLabel("Selecione a profissão...");
      }
    }
  }, [specialties, initialProfessional, reset]);

  async function sendDatas(data: PediatricianData) {
    if (!initialProfessional) return;

    const selectedSpecialty = specialties.find(
      (spec) => spec.specialization_name === data.profession,
    );

    const specialtyId = selectedSpecialty
      ? selectedSpecialty.id_specialization
      : initialProfessional.fk_id_specialization;

    const payload = {
      professional_name: data.name,
      phone: data.phone,
      last_consultation: data.last_appointment_date,
      address: data.address,
      fk_id_child: childId,
      fk_id_specialization: specialtyId,
      description: data.description,
    };

    try {
      await updateProfessional({
        idProfessional: initialProfessional.id_professional,
        data: payload,
      });

      Alert.alert("Sucesso", "Profissional atualizado com sucesso!");
      setIsEditing(false);
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao editar profissional.");
    }
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setValue("last_appointment_date", formattedDate, {
        shouldValidate: true,
      });
    }
  };

  const getDisplayDate = (dateString: string) => {
    if (!dateString) return "DD/MM/AAAA";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  if (!initialProfessional) {
    return (
      <View className="flex-1 justify-center items-center bg-light">
        <Text className="font-poppins text-primary-text">
          Dados do profissional não encontrados.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 w-full bg-light"
    >
      <View className="px-6">
        <View className="flex flex-col w-full justify-between h-full mt-2">
          <View className="flex flex-col mb-4">
            <Text className={labelClassName}>Nome</Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: "O nome é obrigatório!" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputDefault
                  placeholder="Ex: Dr. Henrique"
                  type="text"
                  className={`${inputClassName} ${!isEditing ? "opacity-70 bg-gray-100" : "bg-white"}`}
                  editable={isEditing}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.name && isEditing && (
              <Text className="text-red-600 text-sm mt-1 font-poppins">
                {errors.name.message}
              </Text>
            )}
          </View>

          <View
            className="relative flex flex-col mb-4"
            style={{ zIndex: 50, elevation: 5 }}
          >
            <Text className={labelClassName}>Profissão</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!isEditing}
              className={`flex-row justify-between items-center p-3 h-12 border border-primary-darker rounded-md ${
                !isEditing ? "opacity-70 bg-gray-100" : "bg-white"
              } ${inputClassName}`}
              onPress={() => setProfessionExpand(!professionExpand)}
            >
              <Text className="text-black font-poppins">{professionLabel}</Text>

              {isLoadingSpecialties ? (
                <ActivityIndicator size="small" color="#9CA3AF" />
              ) : (
                <SetSelectorIcon
                  width={24}
                  height={24}
                  style={
                    professionExpand
                      ? { transform: [{ rotate: "180deg" }] }
                      : {}
                  }
                />
              )}
            </TouchableOpacity>

            {professionExpand && isEditing && (
              <View
                className="absolute top-13 w-full rounded-b-lg border-b border-l border-r border-primary-darker bg-white py-2 shadow-purple-sm max-h-48"
                style={{ zIndex: 100, elevation: 10 }}
              >
                <ScrollView
                  nestedScrollEnabled={true}
                  style={{ maxHeight: 180 }}
                >
                  {specialties.map((spec) => (
                    <TouchableOpacity
                      key={spec.id_specialization}
                      className="flex-row items-center w-full h-10 pl-4 border-b border-gray-100"
                      onPress={() => {
                        setValue("profession", spec.specialization_name, {
                          shouldValidate: true,
                        });
                        setProfessionLabel(spec.specialization_name);
                        setProfessionExpand(false);
                      }}
                    >
                      <Text className={labelRadioButton}>
                        {spec.specialization_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {errors.profession && isEditing && (
              <Text className="text-red-600 text-sm mt-1 font-poppins">
                {errors.profession.message}
              </Text>
            )}
          </View>

          <View className="flex flex-col mb-4" style={{ zIndex: 10 }}>
            <Text className={labelClassName}>Endereço</Text>
            <Controller
              control={control}
              name="address"
              rules={{ required: "O endereço é obrigatório!" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputDefault
                  placeholder="Ex: Av. das Orquídeas, 450"
                  type="text"
                  className={`${inputClassName} ${!isEditing ? "opacity-70 bg-gray-100" : "bg-white"}`}
                  editable={isEditing}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.address && isEditing && (
              <Text className="text-red-600 text-sm mt-1 font-poppins">
                {errors.address.message}
              </Text>
            )}
          </View>

          <View className="flex flex-col mb-4" style={{ zIndex: 10 }}>
            <Text className={labelClassName}>Data da última consulta</Text>
            <Controller
              control={control}
              name="last_appointment_date"
              rules={{ required: "A data da última consulta é obrigatória!" }}
              render={({ field: { value } }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={!isEditing}
                  onPress={() => setShowDatePicker(true)}
                  className={`justify-center h-12 p-3 border border-primary-darker rounded-md ${
                    !isEditing ? "opacity-70 bg-gray-100" : "bg-white"
                  }`}
                >
                  <Text
                    className={`font-poppins ${value ? "text-primary-text" : "text-gray-400"}`}
                  >
                    {getDisplayDate(value)}
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.last_appointment_date && isEditing && (
              <Text className="text-red-600 text-sm mt-1 font-poppins">
                {errors.last_appointment_date.message}
              </Text>
            )}

            {showDatePicker && isEditing && (
              <DateTimePicker
                value={
                  control._formValues.last_appointment_date
                    ? new Date(control._formValues.last_appointment_date)
                    : new Date()
                }
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={onDateChange}
              />
            )}
          </View>

          <View className="flex flex-col mb-4" style={{ zIndex: 10 }}>
            <Text className={labelClassName}>Número de telefone</Text>
            <Controller
              control={control}
              name="phone"
              rules={{ required: "O número de telefone é obrigatório!" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputDefault
                  placeholder="(11) 4002-8922"
                  type="number"
                  className={`${inputClassName} ${!isEditing ? "opacity-70 bg-gray-100" : "bg-white"}`}
                  editable={isEditing}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.phone && isEditing && (
              <Text className="text-red-600 text-sm mt-1 font-poppins">
                {errors.phone.message}
              </Text>
            )}
          </View>

          <View className="flex flex-col mb-8" style={{ zIndex: 10 }}>
            <Text className={labelClassName}>Descrição</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputDefault
                  multiline
                  numberOfLines={4}
                  type="text"
                  placeholder="Consultamos para tratar de doenças e etc..."
                  className={`h-32 p-3 mt-1 border border-primary-darker font-poppins rounded-lg bg-white text-primary-text`}
                  style={{ textAlignVertical: "top" }}
                  editable={isEditing}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>

          <View
            className="flex-row justify-between w-full h-12 mt-auto mb-10"
            style={{ zIndex: 10 }}
          >
            <BtnPrimary
              text="Voltar"
              className={`flex-1 mr-2 items-center justify-center bg-white shadow-purple-md rounded-xl`}
              textClassName="font-poppins font-bold text-gray-700"
              onPress={() => {
                if (isEditing) {
                  setIsEditing(false);
                } else {
                  router.back();
                }
              }}
              disabled={isPending}
            />

            <BtnPrimary
              text={
                isPending
                  ? "Salvando..."
                  : isEditing
                    ? "Registrar edição"
                    : "Editar"
              }
              className={`flex-1 ml-2 items-center justify-center bg-accent rounded-xl`}
              textClassName="text-white font-poppins font-bold"
              onPress={
                isEditing ? handleSubmit(sendDatas) : () => setIsEditing(true)
              }
              disabled={isPending}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
