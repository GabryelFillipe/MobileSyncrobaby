import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import BtnPrimary from "../../src/components/BtnPrimary";
import { InputDefault } from "../../src/components/InputDefault";
import {
  buttonCancel,
  buttonSubmit,
  inputClassName,
  labelClassName,
  labelRadioButton,
} from "../../src/style/globalStyles";

import SetSelectorIcon from "../../src/assets/icons/setExpandSelector.svg";

interface PediatricianData {
  name: string;
  profession: string;
  address: string;
  last_appointment_date: string;
  phone: string;
  description?: string;
}

const MOCK_SPECIALTIES = [
  { id_specialization: 1, specialization_name: "Pediatria Geral" },
  { id_specialization: 2, specialization_name: "Odontopediatria" },
  { id_specialization: 3, specialization_name: "Neuropediatria" },
];

const MOCK_PROFESSIONAL = {
  id_professional: 1,
  professional_name: "Dr. Henrique Cavalcante",
  specialty: "Odontopediatria",
  address: "Av. das Orquídeas, 450",
  phone: "(11) 4002-8922",
  last_consultation: "2026-03-15T00:00:00.000Z",
  description: "Acompanhamento semestral de rotina.",
  fk_id_specialization: 2,
};

export default function EditProfessional() {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [professionExpand, setProfessionExpand] = useState<boolean>(false);
  const [professionLabel, setProfessionLabel] = useState<string>(
    MOCK_PROFESSIONAL.specialty || "Selecione a profissão...",
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PediatricianData>({
    defaultValues: {
      name: MOCK_PROFESSIONAL.professional_name || "",
      profession: MOCK_PROFESSIONAL.specialty || "",
      address: MOCK_PROFESSIONAL.address || "",
      phone: MOCK_PROFESSIONAL.phone || "",
      last_appointment_date: MOCK_PROFESSIONAL.last_consultation
        ? MOCK_PROFESSIONAL.last_consultation.split("T")[0]
        : "",
      description: MOCK_PROFESSIONAL.description || "",
    },
  });

  function sendDatas(data: PediatricianData) {
    const selectedSpecialty = MOCK_SPECIALTIES.find(
      (spec) => spec.specialization_name === data.profession,
    );
    const specialtyId = selectedSpecialty
      ? selectedSpecialty.id_specialization
      : MOCK_PROFESSIONAL.fk_id_specialization;

    const payload = {
      professional_name: data.name,
      phone: data.phone,
      last_consultation: data.last_appointment_date,
      address: data.address,
      fk_id_child: 1,
      fk_id_specialization: specialtyId,
      description: data.description,
    };

    console.log("Dados prontos para edição:", payload);
    setIsEditing(false);
  }

  return (
    <ScrollView className="flex-1 w-full z-10 bg-white">
      <View className="flex flex-col w-full justify-between h-full px-4 py-2 mt-2">
        <View className="flex flex-col mb-4">
          <Text className={labelClassName}>Nome</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "O nome é obrigatório!" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputDefault
                placeholder="Ex: Dr. Henrique"
                className={`${inputClassName} ${!isEditing ? "opacity-70 bg-gray-100" : "bg-white"}`}
                editable={isEditing}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && isEditing && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.name.message}
            </Text>
          )}
        </View>

        <View className="relative flex flex-col mb-4 z-50">
          <Text className={labelClassName}>Profissão</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!isEditing}
            className={`flex-row justify-between items-center z-50 p-3 border border-gray-300 rounded-md ${
              !isEditing ? "opacity-70 bg-gray-100" : "bg-white"
            } ${inputClassName}`}
            onPress={() => setProfessionExpand(!professionExpand)}
          >
            <Text className="text-black">{professionLabel}</Text>
            <SetSelectorIcon
              width={24}
              height={24}
              style={
                professionExpand ? { transform: [{ rotate: "180deg" }] } : {}
              }
            />
          </TouchableOpacity>

          {professionExpand && isEditing && (
            <View className="absolute top-16 w-full rounded-b-lg border-b border-l border-r border-gray-300 bg-white z-40 py-2 shadow-sm">
              {MOCK_SPECIALTIES.map((spec) => (
                <TouchableOpacity
                  key={spec.id_specialization}
                  className="flex-row items-center w-full h-10 pl-4"
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
            </View>
          )}
          {errors.profession && isEditing && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.profession.message}
            </Text>
          )}
        </View>

        <View className="flex flex-col mb-4">
          <Text className={labelClassName}>Endereço</Text>
          <Controller
            control={control}
            name="address"
            rules={{ required: "O endereço é obrigatório!" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputDefault
                placeholder="Ex: Av. das Orquídeas, 450"
                className={`${inputClassName} ${!isEditing ? "opacity-70 bg-gray-100" : "bg-white"}`}
                editable={isEditing}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.address && isEditing && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.address.message}
            </Text>
          )}
        </View>

        <View className="flex flex-col mb-4">
          <Text className={labelClassName}>Data da última consulta</Text>
          <Controller
            control={control}
            name="last_appointment_date"
            rules={{ required: "A data da última consulta é obrigatória!" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputDefault
                placeholder="AAAA-MM-DD"
                className={`${inputClassName} ${!isEditing ? "opacity-70 bg-gray-100" : "bg-white"}`}
                editable={isEditing}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.last_appointment_date && isEditing && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.last_appointment_date.message}
            </Text>
          )}
        </View>

        <View className="flex flex-col mb-4">
          <Text className={labelClassName}>Número de telefone</Text>
          <Controller
            control={control}
            name="phone"
            rules={{ required: "O número de telefone é obrigatório!" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputDefault
                placeholder="(11) 4002-8922"
                keyboardType="phone-pad"
                className={`${inputClassName} ${!isEditing ? "opacity-70 bg-gray-100" : "bg-white"}`}
                editable={isEditing}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.phone && isEditing && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.phone.message}
            </Text>
          )}
        </View>

        <View className="flex flex-col mb-6">
          <Text className={labelClassName}>Descrição</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputDefault
                multiline
                numberOfLines={4}
                placeholder="Consultamos para tratar de doenças e etc..."
                className={`h-32 p-2 mt-1 border border-primary-dark rounded-lg text-lg ${
                  !isEditing ? "opacity-70 bg-white" : "bg-white"
                }`}
                style={{ textAlignVertical: "top" }}
                editable={isEditing}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>

        <View className="flex-row justify-between w-full h-12 mb-10">
          <BtnPrimary
            text="Voltar"
            className={`flex-1 mr-2 items-center justify-center bg-gray-300 ${buttonCancel}`}
            textClassName=" font-bold"
            onPress={() => router.back()}
          />

          <BtnPrimary
            text={isEditing ? "Registrar edição" : "Editar"}
            className={`flex-1 ml-2 items-center justify-center bg-purple-600 ${buttonSubmit}`}
            textClassName="text-white font-bold"
            onPress={
              isEditing ? handleSubmit(sendDatas) : () => setIsEditing(true)
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}
