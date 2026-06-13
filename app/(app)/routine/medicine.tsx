import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaskInput from "react-native-mask-input";
import BtnPrimary from "../../../src/components/BtnPrimary";

import type { ProductStorage } from "@/src/services/storage/storage.service";
import { useGetProductByTypeStorage } from "../../../src/services/hook/storage/useGetProductByTypeStorage";

import { useRegisterMedication } from "@/src/services/hook/routines/useInsertMedication";
import type { RegisterMedication } from "@/src/services/routines/routines.service";

import DateUtils from "../../../src/utils/Date";

export const inputClassName: string =
  'className="w-full h-11 mt-1 border border-primary-darker bg-white rounded-sm px-2 text-lilas-dark font-semibold text-lg md:h-14 xl:bg-white xl:h-11 xl:px-4 caret-primary-darker';
export const labelClassName: string =
  "font-poppins text-primary-darker font-bold md:text-xl";
export const buttonSubmit: string =
  "w-[45%] h-10 bg-accent text-white md:w-[40%] md:h-12 xl:w-[25%] xl:h-10";
export const buttonCancel: string =
  "w-[45%] h-10 text-dark-purple font-semibold bg-white shadow-purple-sm md:w-[35%] md:h-12 xl:w-[25%] xl:h-10";
export const radioButton: string =
  "appearance-none w-3 h-3 border-2 border-accent rounded-full checked:border-accent checked:border-[6px]";
export const labelRadioButton: string =
  "font-nunito text-primary-darker font-semibold";
export const inputMeasureClass: string =
  "flex w-18 h-6 bg-lilas border border-primary-darker text-primary-darker shadow-purple-sm rounded-lg md:w-20 md:h-7";
export const listProductsClass: string =
  "flex flex-col w-full min-h-28 border border-primary-darker bg-white rounded-lg px-4 py-3 gap-2 overflow-y-auto md:gap-4 xl:bg-white xl:min-h-24 xl:max-h-24 xl:px-6";

interface ProductStorageLocal {
  id: number;
  product_name: string;
  measure: string;
}

function RoutineMedicine() {
  const navigation = useNavigation();

  const [childId, setChildId] = useState<number>(0);

  const { mutate: onRegisterMedicine } = useRegisterMedication();

  const { data: onGetProducts } = useGetProductByTypeStorage(2, childId);

  const [expandRemedy, setExpandRemedy] = useState<boolean>(false);
  const [remedyListSelected, setRemedyListSelected] = useState<string>("");
  const [idRemedySelected, setIdRemedySelected] = useState<number>(0);
  const [disableInput, setDisableInput] = useState<boolean>(true);
  const [measure, setMeasure] = useState<string>("");

  const [dateTime, setDateTime] = useState<string>("");
  const timeMask = [
    /[0-2]/,
    dateTime.charAt(0) === "2" ? /[0-3]/ : /[0-9]/,
    ":",
    /[0-5]/,
    /[0-9]/,
  ];
  const [dosage, setDosage] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [remedyMain, setRemedyMain] = useState<ProductStorage[]>([]);
  const [remedy, setRemedy] = useState<ProductStorage[]>([]);

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
    if (onGetProducts && onGetProducts.stock) {
      setRemedy(onGetProducts.stock);
      setRemedyMain(onGetProducts.stock);
    }
  }, [onGetProducts]);

  function filterRemedy(text: string) {
    const newData = remedyMain.filter((it) =>
      it.product_name?.toLowerCase().includes(text.toLowerCase()),
    );
    setRemedy(newData);
  }

  function selectRemedy(item: ProductStorage) {
    setRemedyListSelected(item.product_name);
    setIdRemedySelected(item.id);
    setExpandRemedy(false);
  }

  function handleRegister() {
    if (!dateTime) {
      Alert.alert("Erro", "Selecione a hora!");
      return;
    }
    if (idRemedySelected === 0) {
      Alert.alert("Erro", "Selecione um medicamento!");
      return;
    }
    if (!dosage) {
      Alert.alert("Erro", "Informe a quantidade do medicamento!");
      return;
    }

    const fullData: RegisterMedication = {
      date_time: DateUtils.convertISO(dateTime),
      product_id: [
        {
          id: idRemedySelected,
          dosage: Number(dosage),
        },
      ],
      description,
      fk_id_child: childId,
    };

    onRegisterMedicine(fullData, {
      onSuccess: () => {
        Alert.alert("Sucesso", "Registro de medicação feito com sucesso!");
        navigation.goBack();
      },
      onError: () => {
        Alert.alert("Erro", "Não foi possível registrar a medicação.");
      },
    });
  }

  return (
    <ScrollView className="w-full min-h-full bg-light">
      <View className="flex flex-col w-full h-full p-4 gap-8">
        <View className="flex flex-col">
          <Text className={labelClassName}>Horário</Text>
          <MaskInput
            keyboardType="numeric"
            mask={timeMask}
            onChangeText={(text) => setDateTime(text)}
            value={dateTime}
            placeholder="00:00"
            className={inputClassName}
          />
        </View>

        <View className="relative flex flex-col z-50">
          <Text className={labelClassName}>Medicação</Text>
          <TextInput
            onChangeText={(text) => {
              setRemedyListSelected(text);
              filterRemedy(text);
            }}
            onFocus={() => setExpandRemedy(true)}
            placeholder="Selecione um medicamento"
            value={remedyListSelected}
            className={`bg-white ${inputClassName}`}
            style={[{ paddingVertical: 0, textAlignVertical: "center" }]}
          />

          {expandRemedy && (
            <View className="absolute w-full h-60 top-20 bg-white border border-primary-darker rounded-b-lg p-2 z-50 shadow-lg">
              <ScrollView
                nestedScrollEnabled={true}
                className="w-full min-h-full"
              >
                {remedy.map((it) => (
                  <TouchableOpacity
                    key={it.id}
                    onPress={() => selectRemedy(it)}
                    className="flex-row items-center w-full min-h-10 pl-2 gap-2 border-b border-gray-100"
                  >
                    <View className="w-4 h-4 rounded-full border-2 border-accent items-center justify-center" />
                    <Text className={labelRadioButton}>{it.product_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View className="flex flex-col">
          <Text className={labelClassName}>Dosagem</Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={setDosage}
            value={dosage}
            placeholder="Ex: 5"
            className={inputClassName}
          />
        </View>

        <View className="flex flex-col">
          <Text className={labelClassName}>Descrição / Observação</Text>
          <TextInput
            onChangeText={setDescription}
            value={description}
            placeholder="Ex: Tomar após as refeições"
            className={inputClassName}
          />
        </View>

        <View className="flex-row justify-between w-full mt-6 pb-10">
          <BtnPrimary
            text="Cancelar"
            onPress={() => navigation.goBack()}
            className={buttonCancel}
          />
          <BtnPrimary
            text="Salvar"
            onPress={handleRegister}
            className={buttonSubmit}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default RoutineMedicine;
