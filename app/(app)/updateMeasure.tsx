import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, View } from "react-native";

import BtnPrimary from "../../src/components/BtnPrimary";
import { InputDefault } from "../../src/components/InputDefault";

import CalcIcon from "../../src/assets/icons/calcAccent.svg";
import MeasuresIcon from "../../src/assets/icons/measureAccent.svg";

import { useInsertMeasures } from "../../src/services/hook/measures/useInsertMeasures";
import type { InsertMeasures } from "../../src/services/measures/measures.service";

interface DataMeasures {
  weight: string;
  height: string;
  head_circumference: string;
  description: string;
}

export default function UpdateMeasures() {
  const router = useRouter();

  const [idChild, setIdChild] = useState<number>(0);
  const { mutate: onInsertMeasures } = useInsertMeasures();

  useEffect(() => {
    async function loadChildId() {
      const storedId = await AsyncStorage.getItem("select_child");
      if (storedId) {
        setIdChild(Number(storedId));
      }
    }
    loadChildId();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DataMeasures>({
    defaultValues: {
      weight: "",
      height: "",
      head_circumference: "",
      description: "",
    },
  });

  function sendData(data: DataMeasures) {
    const heightStr = data.height?.trim();
    const weightStr = data.weight?.trim();
    const headStr = data.head_circumference?.trim();

    if (!heightStr && !weightStr && !headStr) {
      Alert.alert("Atenção", "Preencha ao menos um campo de medidas!");
      return;
    }

    const parseValue = (val?: string) =>
      val ? Number(val.replace(",", ".")) : null;

    const newData: InsertMeasures = {
      height: parseValue(heightStr),
      weight: parseValue(weightStr),
      head_circumference: parseValue(headStr),
      description: data.description,
      fk_id_child: idChild,
    };

    onInsertMeasures(newData, {
      onSuccess: () => {
        Alert.alert("Sucesso", "Medidas registradas com sucesso!");
        router.back();
      },
      onError: () => {
        Alert.alert(
          "Erro",
          "Não foi possível registrar as medidas. Tente novamente.",
        );
      },
    });
  }

  return (
    <ScrollView
      className="flex-1 w-full bg-light"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 w-full pb-10">
        <View className="flex flex-col bg-white rounded-2xl mx-4 mt-10 pb-6 shadow-sm overflow-hidden">
          <LinearGradient
            colors={["#F4EBFB", "#FFEFEF"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            className="flex flex-col items-center w-full pt-6 pb-6 px-4"
          >
            <View className="flex justify-center items-center w-12 h-12 bg-white rounded-full shadow-sm mb-3">
              <MeasuresIcon width={24} height={24} />
            </View>
            <Text className="font-poppins text-darker-purple font-bold text-xl mb-1">
              Atualizar Medidas
            </Text>
            <Text className="font-nunito text-gray-500 text-center text-sm px-2">
              Acompanhe de perto o desenvolvimento do seu bebê
            </Text>
          </LinearGradient>

          <View className="px-4 mt-6">
            <View className="flex flex-row w-full p-4 items-center gap-4 border-2 border-dashed border-accent rounded-2xl bg-white">
              <View className="flex justify-center items-center w-10 h-10 bg-lilas rounded-full shrink-0">
                <CalcIcon width={20} height={20} />
              </View>
              <View className="flex flex-col flex-1">
                <Text className="text-darker-purple text-base font-bold font-poppins mb-1">
                  Cálculo Automático
                </Text>
                <Text className="text-gray-500 text-xs font-semibold leading-tight">
                  O IMC será calculado nos gráficos com base no peso e altura
                  inseridos abaixo.
                </Text>
              </View>
            </View>
          </View>

          <View className="flex flex-row justify-between w-full px-4 mt-6 gap-3">
            <View className="flex-1 flex-col">
              <Text className="text-primary-darker font-semibold text-xs mb-1">
                Peso
              </Text>
              <View className="flex-row items-center border border-primary-darker rounded-md px-2 h-10">
                <Controller
                  control={control}
                  name="weight"
                  rules={{ maxLength: { value: 5, message: "Excedido!" } }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputDefault
                      id="weight"
                      keyboardType="decimal-pad"
                      className="flex-1 text-primary h-full bg-transparent border-0"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                <Text className="text-primary font-bold text-xs ml-1 shrink-0">
                  KG
                </Text>
              </View>
              <Text className="text-gray-400 text-[10px] mt-1 h-4">
                {errors.weight ? errors.weight.message : ""}
              </Text>
            </View>

            <View className="flex-1 flex-col">
              <Text className="text-primary-darker font-semibold text-xs mb-1">
                Altura
              </Text>
              <View className="flex-row items-center border border-primary-darker rounded-md px-2 h-10">
                <Controller
                  control={control}
                  name="height"
                  rules={{ maxLength: { value: 5, message: "Excedido!" } }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputDefault
                      id="height"
                      keyboardType="decimal-pad"
                      className="flex-1 text-primary h-full bg-transparent border-0"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                <Text className="text-primary font-bold text-xs ml-1 shrink-0">
                  CM
                </Text>
              </View>
              <Text className="text-gray-400 text-[10px] mt-1 h-4">
                {errors.height ? errors.height.message : ""}
              </Text>
            </View>

            <View className="flex-1 flex-col">
              <Text
                className="text-primary-darker font-semibold text-[10px] mb-1 leading-tight"
                numberOfLines={1}
              >
                Perímetro Cef.
              </Text>
              <View className="flex-row items-center border border-primary-darker rounded-md px-2 h-10">
                <Controller
                  control={control}
                  name="head_circumference"
                  rules={{ maxLength: { value: 5, message: "Excedido!" } }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputDefault
                      id="head_circumference"
                      keyboardType="decimal-pad"
                      className="flex-1 text-primary h-full bg-transparent border-0"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                <Text className="text-primary font-bold text-xs ml-1 shrink-0">
                  CM
                </Text>
              </View>
              <Text className="text-gray-400 text-[10px] mt-1 h-4">
                {errors.head_circumference
                  ? errors.head_circumference.message
                  : ""}
              </Text>
            </View>
          </View>

          <View className="flex flex-col px-4 mt-2">
            <Text className="text-primary-darker font-semibold text-sm mb-1">
              Descrição
            </Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputDefault
                  multiline
                  numberOfLines={4}
                  className="h-28 p-3 border border-primary-darker rounded-md text-primary bg-white"
                  style={{ textAlignVertical: "top" }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>

          <View className="flex flex-row justify-between px-4 mt-8 gap-4 w-full">
            <BtnPrimary
              text="Cancelar"
              onPress={() => router.back()}
              className="flex-1 items-center justify-center h-12 bg-white shadow-purple-md  rounded-lg"
              textClassName="text-primary-text font-bold text-base"
            />
            <BtnPrimary
              text="Registrar"
              onPress={handleSubmit(sendData)}
              className="flex-1 items-center justify-center h-12 bg-accent rounded-lg shadow-purple-md"
              textClassName="text-white font-semibold text-base"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
