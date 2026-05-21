import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";

import BtnPrimary from "../../src/components/BtnPrimary";
import { InputDefault } from "../../src/components/InputDefault";

import SetSelector from "../../src/assets/icons/setExpandSelector.svg";

import {
  buttonCancel,
  buttonSubmit,
  inputClassName,
  labelClassName,
  labelRadioButton,
} from "../../src/style/globalStyles";

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

export default function AddPediatrician() {
  const navigation = useNavigation();
  const childId = 1;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PediatricianData>();

  const [professionExpand, setProfessionExpand] = useState<boolean>(false);
  const [professionLabel, setProfessionLabel] = useState<string>(
    "Selecione a profissão...",
  );

  function sendDatas(data: PediatricianData) {
    const selectedSpecialty = MOCK_SPECIALTIES.find(
      (spec) => spec.specialization_name === data.profession,
    );
    const specialtyId = selectedSpecialty
      ? selectedSpecialty.id_specialization
      : 1;

    const payload = {
      professional_name: data.name,
      phone: data.phone,
      last_consultation: data.last_appointment_date,
      address: data.address,
      fk_id_child: childId,
      fk_id_specialization: specialtyId,
    };

    console.log("Dados prontos para envio:", payload);
    navigation.goBack();
  }

  return (
    <View className="flex-1 w-full z-10 bg-light">
      <View className="flex flex-col gap-0 w-full justify-between h-full px-4 py-2 mt-2">
        <View className="flex flex-col mb-4">
          <Text className={labelClassName}>Nome</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "O nome é obrigatório!" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputDefault
                placeholder="Dr. Henrique Cavalcante"
                className={inputClassName}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.name.message}
            </Text>
          )}
        </View>

        <View className="relative flex flex-col mb-4 z-50">
          <Text className={labelClassName}>Profissão</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            className={`flex-row justify-between items-center z-50 p-3 bg-white border border-gray-300 rounded-md ${inputClassName}`}
            onPress={() => setProfessionExpand(!professionExpand)}
          >
            <Text className="text-black">{professionLabel}</Text>
            <SetSelector
              width={24}
              height={24}
              style={
                professionExpand ? { transform: [{ rotate: "180deg" }] } : {}
              }
              className={`${professionExpand ? "rotate-180" : ""}`}
            />
          </TouchableOpacity>

          {professionExpand && (
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
          {errors.profession && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.profession.message}
            </Text>
          )}
        </View>

        {/* Campo Endereço */}
        <View className="flex flex-col mb-4">
          <Text className={labelClassName}>Endereço</Text>
          <Controller
            control={control}
            name="address"
            rules={{ required: "O endereço é obrigatório!" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputDefault
                placeholder="Av. das Orquídeas, 450"
                className={inputClassName}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.address && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.address.message}
            </Text>
          )}
        </View>

        {/* Campo Data da última consulta */}
        <View className="flex flex-col mb-4">
          <Text className={labelClassName}>Data da última consulta</Text>
          <Controller
            control={control}
            name="last_appointment_date"
            rules={{ required: "A data da última consulta é obrigatória!" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputDefault
                placeholder="DD/MM/AAAA"
                className={inputClassName}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.last_appointment_date && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.last_appointment_date.message}
            </Text>
          )}
        </View>

        {/* Campo Telefone */}
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
                className={inputClassName}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.phone && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.phone.message}
            </Text>
          )}
        </View>

        {/* Campo Descrição */}
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
                className="h-32 p-2 mt-1 border border-gray-300 rounded-lg text-lg bg-white"
                style={{ textAlignVertical: "top" }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>

        {/* Botões */}
        <View className="flex-row justify-between w-full h-12 mb-10">
          <BtnPrimary
            text="Cancelar"
            className={`flex-1 mr-2 items-center justify-center bg-gray-300 ${buttonCancel}`}
            onPress={() => navigation.goBack()}
          />

          <BtnPrimary
            text="Registrar"
            className={`flex-1 ml-2 items-center justify-center bg-purple-600 ${buttonSubmit}`}
            onPress={handleSubmit(sendDatas)}
          />
        </View>
      </View>
    </View>
  );
}
