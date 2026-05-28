import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import BtnPrimary from "../../../src/components/BtnPrimary";
import { InputDefault } from "../../../src/components/InputDefault";

import { useGetProductByType } from "@/src/services/hook/product/useGetProductByType";

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
    const { data: onGetProducts } = useGetProductByType(6)
    const navigation = useNavigation();

    const [childrenSelected, setChildSelected] = useState<number>(1);
    const [expandRemedy, setExpandRemedy] = useState<boolean>(false);
    const [remedyListSelected, setRemedyListSelected] = useState<string>("");
    const [idRemedySelected, setIdRemedySelected] = useState<number>(0);
    const [disableInput, setDisableInput] = useState<boolean>(true);
    const [measure, setMeasure] = useState<string>("");

    const [dateTime, setDateTime] = useState<string>("");
    const [dosage, setDosage] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [remedyMain] = useState<ProductStorageLocal[]>([
        { id: 1, product_name: "Paracetamol Gotas", measure: "gts" },
        { id: 2, product_name: "Ibuprofeno Alívio", measure: "ml" },
        { id: 3, product_name: "Dipirona Monoidratada", measure: "gts" },
        { id: 4, product_name: "Amoxicilina Suspensão", measure: "ml" }
    ]);
    const [remedy, setRemedy] = useState<ProductStorageLocal[]>(remedyMain);

    useEffect(() => {
        const now = new Date();
        const hour = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setDateTime(`${hour}:${minutes}`);
    }, []);

    useEffect(() => {
        if (!onGetProducts) {
            return
        }

        if (onGetProducts) {
            console.log(onGetProducts)
        }
    }, [onGetProducts])

    function selectRemedy(item: ProductStorageLocal) {
        setIdRemedySelected(item.id);
        setExpandRemedy(false);
        setDisableInput(false);

        if (item.product_name && item.measure) {
            setRemedyListSelected(item.product_name);
            setMeasure(item.measure);
        }
    }

    function filterRemedy(text: string) {
        const newData = remedyMain.filter(it => 
            it.product_name?.toLowerCase().includes(text.toLowerCase())
        );
        setRemedy(newData);
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

        // Print dos dados salvos localmente
        console.log({
            date_time: dateTime,
            product_id: {
                id: idRemedySelected,
                dosage: Number(dosage)
            },
            description,
            fk_id_child: childrenSelected
        });

        Alert.alert("Sucesso", "Medicamento registrado localmente!");
    }

    return (
        <View className="w-full min-h-full">
            <View className="flex w-full">
            </View>

            <View className="flex flex-col w-full h-full p-4 gap-12">
                
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
                    />

                    {expandRemedy && (
                        <View className="absolute w-full max-h-60 top-20 bg-white border border-primary-darker rounded-b-lg p-2 z-50 shadow-lg">
                            <ScrollView nestedScrollEnabled={true}>
                                {remedy.map((it) => (
                                    <TouchableOpacity 
                                        key={it.id} 
                                        onPress={() => selectRemedy(it)}
                                        className="flex-row items-center w-full h-10 pl-2 gap-2 border-b border-gray-100"
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
                    <Text className={labelClassName}>Dose</Text>
                    <View className={`flex-row items-center justify-between px-2 ${inputClassName}`}>
                        <TextInput 
                            editable={!disableInput}
                            keyboardType="numeric"
                            onChangeText={(text) => setDosage(text.replace(/[^0-9]/g, ''))}
                            value={dosage}
                            placeholder="0"
                            className="flex-1 h-full p-0 text-primary-darker font-semibold text-lg"
                        />
                        <Text className="text-primary-darker pl-1 font-semibold text-lg">{measure}</Text>
                    </View>
                </View>

                <View className="flex flex-col">
                    <Text className={labelClassName}>Descrição</Text>
                    <TextInput 
                        onChangeText={setDescription}
                        value={description}
                        multiline
                        numberOfLines={4}
                        placeholder="Adicione observações sobre a medicação..."
                        className={`h-40 ${inputClassName}`}
                        style={{ textAlignVertical: 'top' }}
                    />
                </View>

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

export default RoutineMedicine;