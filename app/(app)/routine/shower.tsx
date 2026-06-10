import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaskInput from 'react-native-mask-input';


import BtnPrimary from "../../../src/components/BtnPrimary";
import { InputDefault } from "../../../src/components/InputDefault";

import { useRegisterBath } from "@/src/services/hook/routines/useInsertBath";
import type { RegisterBath } from "@/src/services/routines/routines.service";

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


import Trash from "../../../src/assets/routines/trashPurple.svg";

interface ProductLocal {
    id: number;
    product_name: string;
    quantity?: number;
}

function RoutineShower() {
    const navigation = useNavigation();

    const { mutate: onRegisterBath } = useRegisterBath();

    const [childrenSelected, setChildSelected] = useState<number>(1);
    const [expandSelectorProduct, setExpandSelectorProduct] = useState<boolean>(false);
    const [productSelected, setProductSelected] = useState<string>("");
    
    const [startTime, setStartTime] = useState<string>("");
    const timeMaskStart = [
        /[0-2]/,
        startTime.charAt(0) === '2' ? /[0-3]/ : /[0-9]/,
        ':',
        /[0-5]/,
        /[0-9]/,
    ];
    const [endTime, setEndTime] = useState<string>("");
    const timeMaskEnd = [
        /[0-2]/,
        endTime.charAt(0) === '2' ? /[0-3]/ : /[0-9]/,
        ':',
        /[0-5]/,
        /[0-9]/,
    ];
    const [timeShower, setTimeShower] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [listProductSelected, setListProductSelected] = useState<ProductLocal[]>([]);

    const [products] = useState<ProductLocal[]>([
        { id: 1, product_name: "Shampoo Infantil" },
        { id: 2, product_name: "Sabonete Líquido" },
        { id: 3, product_name: "Condicionador" },
        { id: 4, product_name: "Óleo Corporal" },
    ]);

    function setListProducts(product: ProductLocal) {
        setExpandSelectorProduct(false);

        if (listProductSelected.some(it => it.id === product.id)) {
            return;
        } else {
            setListProductSelected([...listProductSelected, { ...product, quantity: 1 }]);
            setProductSelected(product.product_name);
        }
    }

    function onHandleQuantity(id: number, quantity: string) {
        // Aceita apenas números
        const cleanQuantity = quantity.replace(/[^0-9]/g, '');

        const newList = listProductSelected.map((it) => {
            if (it.id === id) {
                return { ...it, quantity: Number(cleanQuantity) };
            } else {
                return it;
            }
        });

        setListProductSelected(newList);
    }

    function removeItemRegister(id: number) {
        const newData = listProductSelected.filter(it => it.id !== id);
        setListProductSelected(newData);
    }

    function handleRegister() {
        const fullData: RegisterBath = {
            start_time: startTime,
            end_time: endTime,
            product_id: listProductSelected,
            description: description,
            fk_id_child: childrenSelected
        };
        
        onRegisterBath(
            fullData,
            {
                onSuccess: () => {
                    Alert.alert("Registro de banho feito com sucesso!")
                }, onError: () => {
                    Alert.alert("Erro!")
                }
            }
        );
    }

    return (
        <View className="w-full min-h-full">
            <View className="flex w-full">
            </View>

            <View className="flex flex-col w-full h-full p-4 gap-4">
                
                <View className="flex flex-col">
                    <Text className={labelClassName}>Horário de início</Text>
                    <MaskInput 
                        keyboardType="numeric"
                        mask={timeMaskStart}
                        onChangeText={(text) => setStartTime(text)}
                        value={startTime}
                        placeholder="00:00"
                        className={inputClassName}
                    />
                </View>

                <View className="flex flex-col">
                    <Text className={labelClassName}>Horário de término</Text>
                    <MaskInput 
                        keyboardType="numeric"
                        mask={timeMaskEnd}
                        onChangeText={(text) => setEndTime(text)}
                        value={endTime}
                        placeholder="00:00"
                        className={inputClassName}
                    />
                </View>

                <View className="flex flex-col">
                    <Text className={labelClassName}>Tempo de banho</Text>
                    <InputDefault 
                        editable={false} 
                        onChangeText={setTimeShower}
                        value={timeShower}
                        placeholder="0h 0min"
                        type="number"
                        className={inputClassName} 
                    />
                </View>

                <View className="relative flex flex-col z-50">
                    <Text className={labelClassName}>
                        Produtos utilizados <Text className="italic text-[12px] font-normal">(Registre apenas items que esgotaram por completo!)</Text>
                    </Text>
                    
                    <TextInput
                        onChangeText={setProductSelected} 
                        onFocus={() => setExpandSelectorProduct(true)}
                        placeholder="Selecione produtos utilizados"
                        value={productSelected} 
                        className={`bg-white ${inputClassName}`} 
                    />

                    {expandSelectorProduct && (
                        <View className="absolute w-full max-h-60 top-10 bg-white border border-primary-darker rounded-b-lg p-2 z-50 shadow-lg">
                            <ScrollView nestedScrollEnabled={true}>
                                {products.map((product) => (
                                    <TouchableOpacity 
                                        key={product.id} 
                                        onPress={() => setListProducts(product)}
                                        className="flex-row items-center w-full h-10 pl-2 gap-2 border-b border-gray-100"
                                    >
                                        <View className="w-4 h-4 rounded-full border-2 border-accent items-center justify-center" />
                                        <Text className={labelRadioButton}>{product.product_name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <View className={listProductsClass}>
                    {listProductSelected.length === 0 ? (
                        <Text className="text-gray-400 italic text-center py-2">Nenhum produto selecionado</Text>
                    ) : (
                        listProductSelected.map((product) => (
                            <View key={product.id} className="flex-row justify-between items-center py-1">
                                <Text className="text-lilas-dark font-semibold text-lg flex-1">
                                    {product.product_name}
                                </Text>
                                
                                <View className="flex-row items-center gap-4">
                                    <View className={`${inputMeasureClass} flex-row items-center justify-between px-2`}>
                                        <TextInput 
                                            keyboardType="numeric"
                                            onChangeText={(val) => onHandleQuantity(product.id, val)} 
                                            value={product.quantity ? String(product.quantity) : ""}
                                            className="w-2/3 p-0 text-center text-primary-darker font-bold" 
                                        />
                                        <Text className="w-1/3 text-primary-darker text-sm text-right">un</Text>
                                    </View>
                                    
                                    <TouchableOpacity onPress={() => removeItemRegister(product.id)}>
                                        <Trash className="w-5 h-5"/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Descrição */}
                <View className="flex flex-col">
                    <Text className={labelClassName}>Descrição</Text>
                    <TextInput 
                        onChangeText={setDescription}
                        value={description}
                        multiline
                        numberOfLines={4}
                        placeholder="Adicione observações sobre o banho..."
                        className={`h-28 ${inputClassName}`}
                        style={{ textAlignVertical: 'top' }}
                    />
                </View>

                {/* Botões de Ação */}
                <View className="flex-row justify-between w-full h-12 mt-4 mb-4">
                    <BtnPrimary 
                        onPress={() => navigation.goBack()} 
                        text="Cancelar" 
                        className={buttonCancel} 
                    />
                    <BtnPrimary 
                        onPress={handleRegister} 
                        text="Registrar" 
                        textClassName="text-white" 
                        className={buttonSubmit} 
                    />
                </View>
            </View>
        </View>
    );
}

export default RoutineShower;