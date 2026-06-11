import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import SolidFood from "../../../src/assets/icons/appleBanana.svg";
import Acessory from "../../../src/assets/icons/iconAcessory.svg";
import Remedy from "../../../src/assets/icons/iconRemedy.svg";
import Hygiene from "../../../src/assets/icons/purpleHygiene.svg";
import SetSelector from "../../../src/assets/icons/setExpandSelector.svg";
import BabyFood from "../../../src/assets/routines/baby_food.svg";
import Milk from "../../../src/assets/routines/milk.svg";

import BtnPrimary from "../../../src/components/BtnPrimary";
import { InputDefault } from "../../../src/components/InputDefault";

import {
  buttonCancel,
  buttonSubmit,
  inputClassName,
  labelRadioButton,
} from "../../../src/style/globalStyles";

import { useGetProductByType } from "../../../src/services/hook/product/useGetProductByType";
import { useGetTypeProduct } from "../../../src/services/hook/product/useGetType";
import type {
  ProductTypeId,
  ResponseTypeProduct,
  TypeProduct,
} from "../../../src/services/product/product.service";

import { useInsertStorage } from "../../../src/services/hook/storage/useInsertStorage";
import type { InsertProduct } from "../../../src/services/storage/storage.service";

interface TypeListProduct {
  id_product_type: number;
  product_type_name: string;
  icon?: React.ElementType;
}

interface Product {
  id: number;
  product_name: string;
  product_category: number;
  quantity: number;
  volume: number;
  measurement_unit: string;
  description: string;
  child_id: number;
}

const labelClass: string =
  "text-primary-darker font-semibold font-poppins text-[16px]";

export default function AddStorage() {
  const router = useRouter();

  const [idChild, setIdChild] = useState<number>(0);

  useEffect(() => {
    async function loadChildId() {
      const storedId = await AsyncStorage.getItem("select_child");
      if (storedId) {
        setIdChild(Number(storedId));
      }
    }
    loadChildId();
  }, []);

  const { data: onGetType } = useGetTypeProduct();
  const { mutate: onInsertProduct } = useInsertStorage();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Product>({
    defaultValues: {
      product_name: "Selecione o tipo de produto",
    },
  });

  const [idProduct, setIdProduct] = useState<number>(0);
  const [typeProduct, setTypeProduct] = useState<number | null>(null);
  const [nameProduct, setNameProduct] = useState<string>(
    "Selecione o tipo do produto",
  );
  const [valueProduct, setValueProduct] = useState<string>("");
  const [typeListProduct, setTypeListProduct] = useState<TypeListProduct[]>([]);
  const [selectProduct, setSelectProduct] = useState<boolean>(false);
  const [listProducts, setListProducts] = useState<ProductTypeId[]>([]);
  const [measureHigh, setMeasureHigh] = useState<string>("");

  const {
    data: onGetProduct,
    isError,
    isLoading,
  } = useGetProductByType(typeProduct ?? 0);

  useEffect(() => {
    if (onGetType) {
      formatedTypeProduct(onGetType);
    }
  }, [onGetType]);

  useEffect(() => {
    if (onGetProduct) {
      setListProducts(onGetProduct?.product);
    }
  }, [onGetProduct]);

  function formatedTypeProduct(data: ResponseTypeProduct) {
    const newDataSplit: TypeProduct[] = data.type.map((it) => {
      const splitName: string[] = it.product_type_name.split("(");
      if (splitName[1]) {
        return { ...it, product_type_name: splitName[1].replace(")", "") };
      }
      return it;
    });

    setIconTypeProduct(newDataSplit);
  }

  function setIconTypeProduct(data: TypeListProduct[]) {
    const dataWithIcon: TypeListProduct[] = data.map((it) => {
      if (it.product_type_name.includes("Alimento sólido")) {
        it.icon = SolidFood;
      } else if (it.product_type_name.includes("Leite e derivados")) {
        it.icon = Milk;
      } else if (it.product_type_name.includes("Papinha ou purê")) {
        it.icon = BabyFood;
      } else if (it.product_type_name.includes("Higiene")) {
        it.icon = Hygiene;
      } else if (it.product_type_name.includes("Saúde")) {
        it.icon = Remedy;
      } else if (it.product_type_name.includes("Acessórios")) {
        it.icon = Acessory;
      }
      return it;
    });
    setTypeListProduct(dataWithIcon);
  }

  function changeTypeProduct(id: number) {
    if (id !== typeProduct) {
      setSelectProduct(false);
      setTypeProduct(id);
      setNameProduct("Selecione o produto");
      setValueProduct("");
      setMeasureHigh("");

      setValue("measurement_unit", "");
      setValue("product_category", id);
    }
  }

  function filterProduct(text: string) {
    if (onGetProduct) {
      const newList: ProductTypeId[] = onGetProduct.product.filter((it) =>
        it.name.toLowerCase().includes(text.toLowerCase()),
      );
      setListProducts(newList);
    }
  }

  function sendData(data: Product) {
    const fullData: InsertProduct = {
      fk_id_child: idChild,
      fk_id_product: idProduct,
      description: data.description,
      quantity: data.quantity,
      volume: data.volume ? data.volume : 0,
    };

    onInsertProduct(fullData, {
      onSuccess: () => {
        router.back();
      },
      onError: () => {},
    });
  }

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setSelectProduct(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View className="w-full min-h-full px-6">
        <View className="w-full h-full flex-col">
          <View className="flex-col w-full">
            <Text className={labelClass}>Tipo de produto</Text>

            <View className="flex-row flex-wrap items-center grow">
              {typeListProduct.map((type) => {
                const IconComponent = type.icon;
                return (
                  <View
                    key={type.id_product_type}
                    className={`w-[30%] h-40 bg-lilas border px-2 border-primary rounded-sm m-1 ${
                      typeProduct === type.id_product_type
                        ? "shadow-purple-sm bg-lilas-dark/10"
                        : ""
                    }`}
                  >
                    <TouchableOpacity
                      onPress={() => changeTypeProduct(type.id_product_type)}
                      activeOpacity={0.8}
                      className="flex-col justify-center items-center font-nunito w-full h-full"
                    >
                      {IconComponent && (
                        <IconComponent width={32} height={32} />
                      )}
                      <Text className="text-primary-darker font-nunito font-semibold text-[14.5px] text-center mt-1">
                        {type.product_type_name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            {errors.product_category && (
              <Text className="text-red-600/70 text-sm font-nunito">
                {errors.product_category.message}
              </Text>
            )}
          </View>

          <View className="flex-col w-full relative">
            <Text className={labelClass}>Produto</Text>
            <View className="flex-col w-full z-40">
              <View className={`flex-row gap-2 items-center ${inputClassName}`}>
                <TextInput
                  editable={typeProduct != null}
                  onChangeText={(text) => {
                    filterProduct(text);
                    setValueProduct(text);
                  }}
                  onFocus={() => setSelectProduct(true)}
                  value={valueProduct}
                  placeholder={nameProduct}
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-primary-text font-poppins"
                />
                <TouchableOpacity
                  onPress={() => setSelectProduct(!selectProduct)}
                >
                  <SetSelector
                    width={16}
                    height={16}
                    className={selectProduct ? "turn-set" : "return-set"}
                  />
                </TouchableOpacity>
              </View>

              {errors.product_name && (
                <Text className="text-red-600/70 text-sm font-nunito">
                  {errors.product_name.message}
                </Text>
              )}

              {selectProduct && typeProduct != null && (
                <View className="absolute top-12 left-0 right-0 z-50 rounded-bl-lg rounded-br-lg border-b border-l border-r border-primary-darker bg-lightest max-h-40 overflow-hidden">
                  {isLoading && (
                    <ActivityIndicator
                      size="small"
                      color="#9CA3AF"
                      className="my-4"
                    />
                  )}
                  {!isLoading && !isError && (
                    <FlatList
                      data={listProducts}
                      keyExtractor={(item) => item.id.toString()}
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled={true}
                      contentContainerStyle={{
                        paddingBottom: 8,
                        paddingTop: 8,
                      }}
                      renderItem={({ item: product }) => (
                        <TouchableOpacity
                          className="flex-row items-center w-full h-10 pl-4 border-b border-gray-100"
                          onPress={() => {
                            setIdProduct(product.id);
                            setValueProduct(product.name);
                            setValue("measurement_unit", product.unit);
                            setMeasureHigh(product.unit);
                            setSelectProduct(false);
                            Keyboard.dismiss();
                          }}
                        >
                          <Text className={labelRadioButton}>
                            {product.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View>
              )}
            </View>
          </View>

          <View className="flex-row justify-between w-full z-10">
            <View className="flex-col w-[30%]">
              <Text className={labelClass}>Quantidade</Text>
              <Controller
                control={control}
                name="quantity"
                rules={{ required: "Campo obrigatório!" }}
                render={({ field: { onChange, value } }) => (
                  <InputDefault
                    editable={idProduct !== 0}
                    onChangeText={onChange}
                    value={value ? value.toString() : ""}
                    keyboardType="numeric"
                    className={inputClassName}
                  />
                )}
              />
              {errors.quantity && (
                <Text className="text-red-600/70 text-[12px] font-nunito">
                  {errors.quantity.message}
                </Text>
              )}
            </View>

            <View
              className={`flex-col w-[30%] ${measureHigh === "un" ? "opacity-40" : ""}`}
            >
              <Text className={labelClass}>Volume</Text>
              <Controller
                control={control}
                name="volume"
                rules={{
                  required: measureHigh === "un" ? false : "Campo obrigatório!",
                }}
                render={({ field: { onChange, value } }) => (
                  <InputDefault
                    editable={measureHigh !== "un" && idProduct !== 0}
                    onChangeText={onChange}
                    value={value ? value.toString() : ""}
                    keyboardType="numeric"
                    className={inputClassName}
                  />
                )}
              />
              {errors.volume && (
                <Text className="text-red-600/70 text-[12px] font-nunito">
                  {errors.volume.message}
                </Text>
              )}
            </View>

            <View className="flex-col w-[30%]">
              <Text className={labelClass}>Grandeza</Text>
              <Controller
                control={control}
                name="measurement_unit"
                render={({ field: { value } }) => (
                  <InputDefault
                    editable={false}
                    value={value}
                    className={inputClassName}
                  />
                )}
              />
            </View>
          </View>

          <View className="flex-col w-full z-10">
            <Text className={labelClass}>Descrição</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  multiline
                  onChangeText={onChange}
                  value={value}
                  textAlignVertical="top"
                  className={`h-36 outline-none ${inputClassName}`}
                />
              )}
            />
          </View>

          <View className="flex-row w-full justify-between items-center h-16 z-10 mb-4">
            <BtnPrimary
              onPress={() => router.back()}
              text="Cancelar"
              className={buttonCancel}
            />
            <BtnPrimary
              onPress={handleSubmit(sendData)}
              text="Registrar"
              className={buttonSubmit}
              textClassName="text-white"
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
