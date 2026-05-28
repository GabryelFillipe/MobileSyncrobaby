import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import BtnPrimary from "../../../src/components/BtnPrimary";
import { InputDefault } from "../../../src/components/InputDefault";

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


import Pee from "../../../src/assets/routines/pee.svg";
import Poop from "../../../src/assets/routines/poop.svg";
import Trash from "../../../src/assets/routines/trashPurple.svg";

interface TypeDiaper {
    id: string;
    type: string;
    img: any;
}

interface ProductStorageLocal {
    id: number;
    product_name: string;
    quantity?: number;
}

function RoutineDiaper() {
    const navigation = useNavigation();

    const [childrenSelected, setChildSelected] = useState<number>(1);
    const [expandSelectorProduct, setExpandSelectorProduct] = useState<boolean>(false);
    const [valueProduct, setValueProduct] = useState<string>("");
    const [productSelected, setProductSelected] = useState<ProductStorageLocal[]>([]);
    const [typeSelected, setTypeSelected] = useState<string>("");

    const [dateTime, setDateTime] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [productsMain] = useState<ProductStorageLocal[]>([
        { id: 1, product_name: "Fralda Pompom M" },
        { id: 2, product_name: "Lenço Umedecido Huggies" },
        { id: 3, product_name: "Pomada Hipoglós" },
        { id: 4, product_name: "Fralda Cremer G" }
    ]);
    const [products, setProducts] = useState<ProductStorageLocal[]>(productsMain);

    const type_diaper: TypeDiaper[] = [
        {
            "id": "stool",
            "type": "Fezes",
            "img": Poop
        },
        {
            "id": "urine",
            "type": "Urina",
            "img": Pee
        }
    ];

    useEffect(() => {
        const now = new Date();
        const hour = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setDateTime(`${hour}:${minutes}`);
    }, []);

    function addProductList(product: ProductStorageLocal) {
        setExpandSelectorProduct(false);
        if (productSelected.some(it => it.id === product.id)) {
            return;
        } else if (product.product_name) {
            setValueProduct(product.product_name);
            setProductSelected([...productSelected, { ...product, quantity: 1 }]);
        }
    }

    function onHandleQuantity(id: number, quantity: string) {
        const cleanQuantity = quantity.replace(/[^0-9]/g, '');
        const newList = productSelected.map((it) => {
            if (it.id === id) {
                return { ...it, quantity: cleanQuantity ? Number(cleanQuantity) : 0 };
            }
            return it;
        });
        setProductSelected(newList);
    }

    function removeItemRegister(id: number) {
        const newData = productSelected.filter(it => it.id !== id);
        setProductSelected(newData);
    }

    function filterProducts(text: string) {
        const newData = productsMain.filter(it => 
            it.product_name.toLowerCase().includes(text.toLowerCase())
        );
        setProducts(newData);
    }

    function sendDatas() {
        if (!dateTime) {
            Alert.alert("Erro", "Hora obrigatória!");
            return;
        }

        if (typeSelected !== "") {
            const newProductList = productSelected.map((it) => {
                return {
                    id: it.id,
                    quantity_product: it.quantity || 0
                };
            });

            const fullDatas = {
                date_time: dateTime,
                type: typeSelected,
                product_id: newProductList,
                description: description,
                fk_id_child: childrenSelected
            };

            console.log("Dados salvos localmente: ", fullDatas);
            Alert.alert("Sucesso", "Troca de fralda registrada localmente!");
        } else {
            Alert.alert("Erro", "Selecione o tipo de registro!");
        }
    }

    return (
        <View className="w-full min-h-full">
            <View className="flex w-full">
            </View>

            <View className="flex flex-col w-full h-full p-4 gap-6">
                
                <View className="flex flex-col">
                    <Text className={labelClassName}>Horário</Text>
                    <InputDefault 
                        keyboardType="numeric"
                        onChangeText={(text) => setDateTime(text.replace(/[^0-9:]/g, ''))}
                        value={dateTime}
                        placeholder="00:00"
                        className={inputClassName} 
                    />
                </View>

                <View className="flex flex-col">
                    <Text className={labelClassName}>Tipo</Text>
                    <View className="flex-row justify-between mt-2">
                        {type_diaper.map((type) => (
                            <TouchableOpacity 
                                key={type.id} 
                                onPress={() => setTypeSelected(type.id)}
                                className={`w-[48%] h-32 bg-lilas border border-primary rounded-lg items-center justify-center gap-2 ${
                                    typeSelected === type.id ? "bg-lilas-dark/10 border-accent" : ""
                                }`}
                            >
                                <type.img />
                                <Text className="font-nunito text-primary-darker text-lg font-semibold">{type.type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="relative flex flex-col z-50">
                    <Text className={labelClassName}>
                        Produtos utilizados <Text className="italic text-[11px] font-normal">(Registre apenas itens que esgotaram por completo!)</Text>
                    </Text>
                    <TextInput
                        onChangeText={(text) => {
                            setValueProduct(text);
                            filterProducts(text);
                        }}
                        onFocus={() => setExpandSelectorProduct(true)}
                        placeholder="Selecione os produtos desejados"
                        value={valueProduct}
                        className={`bg-white ${inputClassName}`}
                    />

                    {expandSelectorProduct && (
                        <View className="absolute w-full max-h-56 top-20 bg-white border border-primary-darker rounded-b-lg p-2 z-50 shadow-lg">
                            <ScrollView nestedScrollEnabled={true}>
                                {products.length === 0 ? (
                                    <View className="flex flex-col w-full py-4 items-center">
                                        <Text className="text-[14px] font-semibold text-gray-400">Nenhum produto encontrado...</Text>
                                    </View>
                                ) : (
                                    products.map((product) => (
                                        <TouchableOpacity 
                                            key={product.id} 
                                            onPress={() => addProductList(product)}
                                            className="flex-row items-center w-full h-10 pl-2 gap-2 border-b border-gray-100"
                                        >
                                            <View className={radioButton} />
                                            <Text className={labelRadioButton}>{product.product_name}</Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <View className={listProductsClass}>
                    {productSelected.length === 0 ? (
                        <Text className="text-gray-400 italic text-center py-2">Nenhum produto selecionado</Text>
                    ) : (
                        productSelected.map((product) => (
                            <View key={product.id} className="flex-row items-center justify-between py-1">
                                <Text className="text-lilas-dark font-semibold text-base flex-1">{product.product_name}</Text>
                                <View className="flex-row gap-4 items-center">
                                    <View className={inputMeasureClass}>
                                        <TextInput 
                                            keyboardType="numeric"
                                            onChangeText={(val) => onHandleQuantity(product.id, val)}
                                            value={String(product.quantity || 1)}
                                            className="w-2/3 p-0 text-center font-bold text-primary-darker"
                                        />
                                        <Text className="w-1/3 text-primary-darker text-xs text-center">un</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => removeItemRegister(product.id)}>
                                        <Trash className="w-5 h-5"/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View className="flex flex-col">
                    <Text className={labelClassName}>Descrição</Text>
                    <TextInput 
                        onChangeText={setDescription}
                        value={description}
                        placeholder="Adicione observações sobre a troca..."
                        className={inputClassName}
                    />
                </View>

                <View className="flex-row justify-between w-full h-12 mt-4 mb-4">
                    <BtnPrimary 
                        onPress={() => navigation.goBack()} 
                        text="Cancelar" 
                        className={buttonCancel} 
                    />
                    <BtnPrimary 
                        onPress={sendDatas} 
                        text="Registrar" 
                        textClassName="text-white" 
                        className={buttonSubmit} 
                    />
                </View>
            </View>
        </View>
    );
}

export default RoutineDiaper;