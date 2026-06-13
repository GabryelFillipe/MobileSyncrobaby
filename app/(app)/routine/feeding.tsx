import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetTypeProduct } from "../../../src/services/hook/product/useGetType";
import { useRegisterFeeding } from "../../../src/services/hook/routines/useInsertFeeding";
import { useGetProductByTypeStorage } from "../../../src/services/hook/storage/useGetProductByTypeStorage";
import type { RegisterFeeding } from "../../../src/services/routines/routines.service";
import type { ProductStorage } from "../../../src/services/storage/storage.service";
import RoutineDate from "../../../src/utils/Date";

import Trash from "../../../src/assets/routines/trashPurple.svg";

import { useRouter } from "expo-router";
import BabyFood from "../../../src/assets/routines/baby_food.svg";
import Milk from "../../../src/assets/routines/milk.svg";
import SolidFood from "../../../src/assets/routines/solidFood.svg";

interface DataFeeding {
  date_time: string;
  food?: string;
  fk_id_product_type: number;
  product_id: {
    id: number;
    quantity_product: number;
  };
  description: string | null;
}

interface ListFood {
  id: number;
  type_id?: number;
  food_name?: string;
  measure?: string;
  quantity_product: number;
}

interface TypeProductLocal {
  id_product_type: number;
  product_type_name: string;
  icon?: React.ElementType;
}

type ParamList = {
  RoutineFeeding: { id: string };
};

export const inputClassName =
  "w-full h-11 mt-1 border border-primary-darker bg-white rounded-sm px-2 text-lilas-dark font-semibold text-lg justify-center";
export const labelClassName =
  "font-poppins text-primary-darker font-bold text-base";
export const buttonSubmit =
  "w-[45%] h-10 bg-accent text-white justify-center items-center shadow-purple-md rounded";
export const buttonCancel =
  "w-[45%] h-10 text-primary-text font-bold bg-white shadow-purple-md justify-center items-center rounded";
export const radioButton =
  "w-4 h-4 border-2 border-accent rounded-full items-center justify-center";
export const radioButtonChecked = "w-2 h-2 bg-accent rounded-full";
export const labelRadioButton =
  "font-nunito text-primary-darker font-semibold text-sm";
export const inputMeasureClass =
  "flex-row w-20 h-8 bg-lilas border border-primary-darker text-primary-darker rounded-lg items-center px-1";
export const listProductsClass =
  "flex-col w-full min-h-[100px] max-h-[150px] border border-primary-darker bg-white rounded-lg px-4 py-3 gap-2";

export default function RoutineFeeding() {
  const router = useRouter();

  const route = useRoute<RouteProp<ParamList, "RoutineFeeding">>();
  const { data: onGetType } = useGetTypeProduct();

  const [idChild, setChildId] = useState<number>(0);

  const { mutate: onInsertFeeding } = useRegisterFeeding();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFeeding>({
    defaultValues: {
      date_time: RoutineDate.getHourFormated(),
      description: "",
    },
  });
  const [typeFood, setTypeFood] = useState<number | null>(null);
  const [foodSelected, setFoodSelected] = useState<string>("");
  const [listFood, setListFood] = useState<ProductStorage[]>([]);
  const [foodExpandSelector, setFoodExpandSelector] = useState<boolean>(false);
  const [valueInputTypeFood, setValueInputTypeFood] = useState<string>(
    "Escolha o tipo de alimento deste registro",
  );

  const [food_type, setFoodType] = useState<TypeProductLocal[]>([]);

  const [foodsMain, setFoodsMain] = useState<ProductStorage[]>([]);
  const [foods, setFoods] = useState<ProductStorage[]>([]);

  const { data: onGetProduct } = useGetProductByTypeStorage(
    typeFood ?? 0,
    idChild,
  );

  function removeItemRegister(id: number) {
    const newData = listFood.filter((it) => it.id !== id);
    setListFood(newData);
  }

  function filterDataTypeProduct(data: any[]) {
    const finalData = data.filter((it) =>
      it.product_type_name.includes("Alimentação"),
    );

    const formatNameType: TypeProductLocal[] = finalData.map((type) => {
      const newName =
        type.product_type_name.split("(")[1]?.replace(")", "") ||
        type.product_type_name;

      let IconType = undefined;

      if (newName.includes("Leite e derivados")) IconType = Milk;
      else if (newName.includes("Alimento sólido")) IconType = SolidFood;
      else if (newName.includes("Papinha ou purê")) IconType = BabyFood;

      return {
        id_product_type: type.id_product_type,
        product_type_name: newName,
        icon: IconType,
      };
    });

    setFoodType(formatNameType);
  }

  function changeFoodSelected(food: ProductStorage) {
    setFoodExpandSelector(false);
    if (listFood.some((it) => it.id === food.id)) {
      return;
    } else {
      setFoodSelected(food.product_name);
      setListFood([...listFood, { ...food, quantity: 1 }]);
    }
  }

  function clearListFood(food_id: number) {
    setTypeFood(food_id);
    const selectedType = food_type.find((t) => t.id_product_type === food_id);
    if (selectedType) {
      setValueInputTypeFood(selectedType.product_type_name);
    }
    if (food_id !== typeFood) {
      setListFood([]);
    }
  }

  function changeQuantityFood(id: number, quantity: string) {
    const parsedQuantity = parseInt(quantity.replace(/[^0-9]/g, ""), 10);
    const newListFood = listFood.map((food) => {
      if (food.id === id) {
        return {
          ...food,
          quantity: isNaN(parsedQuantity) ? 0 : parsedQuantity,
        };
      }
      return food;
    });
    setListFood(newListFood);
  }

  function sendDatas(datas: DataFeeding) {
    let newListFood: ListFood[] = [];

    if (listFood.length > 0 && !listFood.some((it) => it.quantity === 0)) {
      newListFood = listFood.map((food) => ({
        id: food.id,
        quantity_product: food.quantity,
      }));
    }

    if (typeFood !== 0 && typeFood !== null) {
      const fullDatas: RegisterFeeding = {
        fk_id_child: idChild,
        date_time: RoutineDate.convertISO(datas.date_time),
        fk_id_product_type: typeFood,
        description: datas.description,
        product_id: newListFood,
      };

      onInsertFeeding(fullDatas, {
        onSuccess: () => {
          router.back();
        },
        onError: () => {
          Alert.alert("Erro", "Ih deu errado hein...");
        },
      });
    } else {
      Alert.alert("Aviso", "Selecione o tipo de registro!");
    }
  }

  function filterFood(text: string) {
    const newData = foodsMain.filter((it) =>
      it.product_name.toLowerCase().includes(text.toLowerCase()),
    );
    setFoods(newData);
  }

  useEffect(() => {
    setFoodSelected("");
  }, [typeFood]);

  useEffect(() => {
    if (onGetType) {
      filterDataTypeProduct(onGetType.type);
    }
  }, [onGetType]);

  useEffect(() => {
    if (!onGetProduct) {
      setFoodsMain([]);
      setFoods([]);
      return;
    }
    setFoodsMain(onGetProduct.stock);
    setFoods(onGetProduct.stock);
  }, [onGetProduct]);

  useEffect(() => {
    async function loadChildId() {
      const storedId = await AsyncStorage.getItem("select_child");
      if (storedId) {
        setChildId(Number(storedId));
      }
    }
    loadChildId();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-light"
    >
      <ScrollView
        className="flex-1 bg-light px-4 py-2 flex"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-col mb-4">
          <Text className={labelClassName}>Horário</Text>
          <Controller
            control={control}
            rules={{ required: "Hora obrigatória" }}
            name="date_time"
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="HH:MM"
                className={`${inputClassName} border p-2`}
              />
            )}
          />
          {errors.date_time && (
            <Text className="text-red-600 text-sm font-nunito mt-1">
              {errors.date_time.message}
            </Text>
          )}
        </View>

        <View className="mb-4">
          <Text className={labelClassName}>Tipo de alimento</Text>
          <View className="flex-row justify-between mt-2">
            {food_type.map((food) => {
              const IconComponent = food.icon;

              return (
                <TouchableOpacity
                  key={food.id_product_type}
                  onPress={() => {
                    clearListFood(food.id_product_type);
                    setFoodExpandSelector(false);
                  }}
                  className={`w-[30%] h-24 rounded-lg bg-lilas border border-primary items-center justify-center p-1 will-change-variable
                    ${typeFood === food.id_product_type ? "bg-purple-100 border-2" : ""}`}
                >
                  {IconComponent && <IconComponent width={32} height={32} />}

                  <Text className="text-center font-nunito text-primary text-xs font-semibold mt-1">
                    {food.product_type_name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="mb-4 relative z-50">
          <Text className={labelClassName}>
            Alimento{" "}
            <Text className="italic text-xs font-normal">
              (Apenas itens esgotados!)
            </Text>
          </Text>
        </Text>
        <TouchableOpacity
          disabled={typeFood === null}
          onPress={() => setFoodExpandSelector(!foodExpandSelector)}
          className={`${inputClassName} border p-2 bg-gray-50`}
        >
          <Text className="text-lilas-dark">
            {typeFood === null
              ? "Selecione um tipo de alimento!"
              : foodSelected || "Clique para selecionar o produto"}
          </Text>
        </TouchableOpacity>

        {foodExpandSelector && typeFood !== null && (
          <View className="absolute top-18 left-0 right-0 border border-primary-darker rounded-b-lg bg-white p-2 max-h-40 z-49">
            {foods.length === 0 ? (
              <View className="items-center py-4">
                <Text className="text-sm font-semibold text-gray-500 mb-2">
                  Nenhum produto deste tipo...
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      "/storage"
                    )
                  }
                  className="bg-accent rounded px-4 py-2">
                  <Text className="text-white font-semibold">
                    Registrar Produto
                  </Text>

                  {/* CORREÇÃO APLICADA NO BOTÃO AQUI */}
                  <TouchableOpacity
                    onPress={() => router.push("/(app)/storage" as any)} // Rota ajustada para o Estoque
                    className="bg-accent rounded px-4 py-2"
                  >
                    <Text className="text-white font-semibold">
                      Registrar Produto
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView nestedScrollEnabled={true}>
                  {foods.map((food) => (
                    <TouchableOpacity
                      key={food.id}
                      onPress={() => changeFoodSelected(food)}
                      className="flex-row items-center py-2 border-b border-gray-100"
                    >
                      <View className={radioButton}>
                        {foodSelected === food.product_name && (
                          <View className={radioButtonChecked} />
                        )}
                      </View>
                      <Text className={`${labelRadioButton} ml-2`}>
                        {food.product_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>

        <View className={`${listProductsClass} mb-4 z-10`}>
          <ScrollView nestedScrollEnabled={true}>
            {listFood.map((food) => (
              <View
                key={food.id}
                className="flex-row justify-between items-center py-1 border-b border-gray-50"
              >
                <Text className="text-lilas-dark font-semibold text-sm flex-1 mr-2">
                  {`${food.product_name} (${food.volume}${food.measure})`}
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className={inputMeasureClass}>
                    <TextInput
                      keyboardType="numeric"
                      onChangeText={(val) => changeQuantityFood(food.id, val)}
                      value={food.quantity ? food.quantity.toString() : ""}
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      className="w-12 p-0 text-sm text-primary-darker"
                    />
                    <Text className="text-xs">un</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeItemRegister(food.id)}>
                    <Trash width={24} height={24} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="flex-col mb-6 z-10">
          <Text className={labelClassName}>Descrição</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value ?? ""}
                maxLength={160}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                className="w-full border border-primary-darker bg-white rounded px-2 py-2 text-lilas-dark min-h-20"
              />
            )}
          />
        </View>

        <View className="flex-row justify-between w-full h-12 mb-8 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className={buttonCancel}
          >
            <Text className="text-dark-purple font-semibold">Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit(sendDatas)}
            className={buttonSubmit}
          >
            <Text className="text-white font-bold">Registrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
