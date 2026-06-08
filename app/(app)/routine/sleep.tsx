import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

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
  "flex flex-col w-full min-h-34 border border-primary-darker bg-white rounded-lg px-4 py-3 gap-2 overflow-y-auto md:gap-4 xl:bg-white xl:min-h-24 xl:max-h-24 xl:px-6";


function RoutineSleep() {
    const navigation = useNavigation();
    const [childrenSelected, setChildSelected] = useState<number>(1);
    
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [timeSleep, setTimeSleep] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    function handleRegister() {
        console.log({
            startTime,
            endTime,
            timeSleep,
            description,
            childrenSelected
        });
    }

    

    return (
        <ScrollView className="w-full min-h-full">
            <View className="flex w-full">
            </View>

            <View className="flex flex-col justify-between w-full h-full gap-6 p-4">
                <View className="flex flex-col mb-4">
                    <Text className={labelClassName}>Hora de início</Text>
                    <InputDefault 
                        onChangeText={setStartTime}
                        value={startTime}
                        placeholder="00:00"
                        type="number"
                        className={inputClassName}
                    />
                </View>
                <View className="flex flex-col mb-4">
                    <Text className={labelClassName}>Hora de término</Text>
                    <InputDefault 
                        onChangeText={setEndTime}
                        value={endTime}
                        placeholder="00:00"
                        type="number"
                        className={inputClassName} 
                    />
                </View>
                <View className="flex flex-col mb-4">
                    <Text className={labelClassName}>Tempo de soneca</Text>
                    <InputDefault 
                        editable={false} 
                        onChangeText={setTimeSleep}
                        value={timeSleep}
                        placeholder="0h 0min"
                        type="number"
                        className={inputClassName} 
                    />
                </View>
                <View className="flex flex-col mb-6">
                    <Text className={labelClassName}>Descrição</Text>
                    <TextInput 
                        onChangeText={setDescription}
                        value={description}
                        multiline
                        numberOfLines={4}
                        placeholder="Adicione observações sobre o sono..."
                        className={`h-40 ${inputClassName}`}
                        style={{ textAlignVertical: 'top' }}
                    />
                </View>
                <View className="flex-row justify-between w-full h-12 mb-2">
                    <BtnPrimary 
                        onPress={() => navigation.goBack()} 
                        text="Cancelar" 
                        className={buttonCancel} 
                    />
                    <BtnPrimary 
                        onPress={handleRegister} 
                        text="Registrar"
                        textClassName="text-white font-bold" 
                        className={buttonSubmit} 
                    />
                </View>
            </View>
        </ScrollView>
    );
}

export default RoutineSleep;