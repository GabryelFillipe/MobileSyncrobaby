import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LoadingBaby } from "@/src/components/Loading";
import SetSelector from "../../../src/assets/icons/setExpandSelector.svg";
import BtnPrimary from "../../../src/components/BtnPrimary";
import { EmptyState } from "../../../src/components/EmptyState";
import { InputDefault } from "../../../src/components/InputDefault";
import { useGetIllness } from "../../../src/services/hook/illness/useGetIllness";
import { useUpdateIllness } from "../../../src/services/hook/illness/useUpdateIllness";
import type { Illness } from "../../../src/services/illness/illness.service";

const labelClass =
  "font-poppins text-primary-darker font-bold text-[15px] mb-1 mt-2";
const inputClass =
  "font-poppins text-primary-text text-[15px] border border-primary-darker rounded-sm w-full h-12 pl-4 bg-white";

export default function EditIllness() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [childId, setChildId] = useState<number>(0);
  const [typeExpand, setTypeExpand] = useState<boolean>(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  useEffect(() => {
    async function fetchChildId() {
      const storedId = await AsyncStorage.getItem("select_child");
      if (storedId) {
        setChildId(Number(storedId));
      }
    }
    fetchChildId();
  }, []);

  const {
    data: illnessData,
    isLoading,
    isError,
  } = useGetIllness(childId, childId !== 0);
  const updateMutation = useUpdateIllness();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Illness>({
    defaultValues: {
      illness_name: "",
      illness_type: "",
      start_date: "",
      end_date: "",
      medication: "",
      description: "",
    },
  });

  useEffect(() => {
    if (illnessData && typeof illnessData !== "string" && illnessData.illness) {
      const illnessDetails = illnessData.illness.find(
        (item: Illness) => item.id_illness === Number(id),
      );

      if (illnessDetails) {
        reset({
          ...illnessDetails,
          start_date: illnessDetails.start_date
            ? illnessDetails.start_date.split("T")[0]
            : "",
          end_date: illnessDetails.end_date
            ? illnessDetails.end_date.split("T")[0]
            : "",
        });
      }
    }
  }, [illnessData, id, reset]);

  const getDisplayDate = (dateString?: string | null) => {
    if (!dateString) return "DD/MM/AAAA";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (
    setShow: (val: boolean) => void,
    onChange: (val: string) => void,
    event: any,
    selectedDate?: Date,
  ) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      onChange(formattedDate);
    }
  };

  function sendDatas(data: Illness) {
    const newData: Illness = {
      ...data,
      end_date: data.end_date === "" ? null : data.end_date,
    };

    updateMutation.mutate(newData);
  }

  const illnessDetails =
    illnessData && typeof illnessData !== "string" && illnessData.illness
      ? illnessData.illness.find(
          (item: Illness) => item.id_illness === Number(id),
        )
      : null;

  if (isLoading || childId === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-light">
        <LoadingBaby message="Carregando detalhe da enfermidade..." />
      </View>
    );
  }

  if (isError || typeof illnessData === "string" || !illnessDetails) {
    return (
      <EmptyState
        isFullPage={true}
        show404Background={true}
        title="Enfermidade não encontrada"
        description="Não conseguimos carregar os dados desta enfermidade."
        buttonText="Voltar"
        onButtonClick={() => router.back()}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 w-full bg-light"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 px-6 pt-4 pb-10">
        <View className="flex-col w-full">
          <View style={{ zIndex: 10 }}>
            <Text className={labelClass}>Nome</Text>
            <Controller
              control={control}
              name="illness_name"
              rules={{ required: "O nome é obrigatório!" }}
              render={({ field: { onChange, value } }) => (
                <InputDefault
                  type="text"
                  placeholder="Ex: Infecção Urinária"
                  placeholderTextColor="#C4B5FD"
                  onChangeText={onChange}
                  value={value || ""}
                  className={inputClass}
                />
              )}
            />
            {errors.illness_name && (
              <Text className="text-red-500 text-sm font-nunito mt-1">
                {errors.illness_name.message}
              </Text>
            )}
          </View>

          <View style={{ zIndex: 50 }}>
            <Text className={labelClass}>Tipo</Text>
            <Controller
              control={control}
              name="illness_type"
              rules={{ required: "Selecione o tipo da enfermidade" }}
              render={({ field: { onChange, value } }) => (
                <View className="relative z-50">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setTypeExpand(!typeExpand)}
                    className={`${inputClass} justify-center pr-4`}
                  >
                    <View className="flex-row justify-between items-center w-full">
                      <Text
                        className={`font-poppins text-[15px] ${
                          value ? "text-primary-text" : "text-primary"
                        }`}
                      >
                        {value === "acute"
                          ? "Aguda (não crônica)"
                          : value === "chronic"
                            ? "Crônica"
                            : "Selecione o tipo..."}
                      </Text>
                      <View
                        style={{
                          transform: [
                            { rotate: typeExpand ? "180deg" : "0deg" },
                          ],
                        }}
                      >
                        <SetSelector width={16} height={16} />
                      </View>
                    </View>
                  </TouchableOpacity>

                  {typeExpand && (
                    <View className="absolute top-12 left-0 right-0 bg-white border border-primary-darker rounded-sm z-50 shadow-purple-sm overflow-hidden">
                      <TouchableOpacity
                        className={`p-4 border-b border-gray-100 ${
                          value === "acute" ? "bg-lilas" : ""
                        }`}
                        onPress={() => {
                          onChange("acute");
                          setTypeExpand(false);
                        }}
                      >
                        <Text className="font-poppins text-primary-text">
                          Aguda (não crônica)
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className={`p-4 ${
                          value === "chronic" ? "bg-lilas" : ""
                        }`}
                        onPress={() => {
                          onChange("chronic");
                          setTypeExpand(false);
                        }}
                      >
                        <Text className="font-poppins text-primary-text">
                          Crônica
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            />
            {errors.illness_type && (
              <Text className="text-red-500 text-sm font-nunito mt-1">
                {errors.illness_type.message}
              </Text>
            )}
          </View>

          <View style={{ zIndex: 40 }}>
            <Text className={labelClass}>Data de início</Text>
            <Controller
              control={control}
              name="start_date"
              rules={{ required: "A data de início é obrigatória!" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowStartDate(true)}
                    className={`justify-center ${inputClass}`}
                  >
                    <Text
                      className={`font-poppins text-[15px] ${
                        value ? "text-primary-text" : "text-primary"
                      }`}
                    >
                      {getDisplayDate(value)}
                    </Text>
                  </TouchableOpacity>
                  {showStartDate && (
                    <DateTimePicker
                      value={value ? new Date(value + "T12:00:00") : new Date()}
                      mode="date"
                      display="default"
                      maximumDate={new Date()}
                      onChange={(e, date) =>
                        handleDateChange(setShowStartDate, onChange, e, date)
                      }
                    />
                  )}
                </>
              )}
            />
            {errors.start_date && (
              <Text className="text-red-500 text-sm font-nunito mt-1">
                {errors.start_date.message}
              </Text>
            )}
          </View>

          <View style={{ zIndex: 30 }}>
            <Text className={labelClass}>Data de término</Text>
            <Controller
              control={control}
              name="end_date"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowEndDate(true)}
                    className={`justify-center ${inputClass}`}
                  >
                    <Text
                      className={`font-poppins text-[15px] ${
                        value ? "text-primary-text" : "text-primary"
                      }`}
                    >
                      {getDisplayDate(value)}
                    </Text>
                  </TouchableOpacity>
                  {showEndDate && (
                    <DateTimePicker
                      value={value ? new Date(value + "T12:00:00") : new Date()}
                      mode="date"
                      display="default"
                      maximumDate={new Date()}
                      onChange={(e, date) =>
                        handleDateChange(setShowEndDate, onChange, e, date)
                      }
                    />
                  )}
                </>
              )}
            />
          </View>

          <View style={{ zIndex: 20 }}>
            <Text className={labelClass}>Medicação</Text>
            <Controller
              control={control}
              name="medication"
              rules={{ required: "A medicação é obrigatória!" }}
              render={({ field: { onChange, value } }) => (
                <InputDefault
                  type="text"
                  placeholder="Ex: Cefuroxima"
                  placeholderTextColor="#C4B5FD"
                  onChangeText={onChange}
                  value={value || ""}
                  className={inputClass}
                />
              )}
            />
            {errors.medication && (
              <Text className="text-red-500 text-sm font-nunito mt-1">
                {errors.medication.message}
              </Text>
            )}
          </View>

          <View style={{ zIndex: 10 }}>
            <Text className={labelClass}>Descrição</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <InputDefault
                  type="text"
                  placeholder="Sintomas registrados durante o tempo da doença."
                  placeholderTextColor="#C4B5FD"
                  onChangeText={onChange}
                  value={value || ""}
                  multiline
                  numberOfLines={5}
                  style={{ textAlignVertical: "top" }}
                  className="font-poppins text-primary-text text-[15px] border border-primary-darker rounded-sm w-full min-h-35 p-4 py-4 bg-white"
                />
              )}
            />
          </View>

          <View
            className="flex-row justify-between items-center w-full mt-8 mb-2"
            style={{ zIndex: 1 }}
          >
            <BtnPrimary
              onPress={() => router.back()}
              text="Cancelar"
              className="w-[45%] h-12 bg-white shadow-purple-sm rounded-sm flex justify-center"
              textClassName="text-dark-purple font-bold text-base text-center"
            />
            <BtnPrimary
              onPress={handleSubmit(sendDatas)}
              text={updateMutation.isPending ? "Salvando..." : "Salvar"}
              className="w-[45%] h-12 bg-accent rounded-sm flex justify-center"
              textClassName="text-white font-bold text-base text-center"
              disabled={updateMutation.isPending}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
