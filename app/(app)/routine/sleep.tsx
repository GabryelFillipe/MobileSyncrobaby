import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import MaskInput from 'react-native-mask-input';

import BtnPrimary from "../../../src/components/BtnPrimary";
import { InputDefault } from "../../../src/components/InputDefault";

import DateUtils from "@/src/utils/Date";

import { useRegisterSleep } from "@/src/services/hook/routines/useInsertSleep";
import type { RegisterSleep } from "@/src/services/routines/routines.service";

export const inputClassName: string =
    'className="w-full h-13 mt-1 border border-primary-darker bg-white rounded-sm px-2 text-lilas-dark font-semibold text-lg md:h-14 xl:bg-white xl:h-11 xl:px-4 caret-primary-darker';
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
    const { mutate: onRegisterSleep } = useRegisterSleep()

    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [timeSleep, setTimeSleep] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    function calculateTimeSleep() {
        const resultTime: string | boolean = DateUtils.subHoursFormated(startTime, endTime)

        if (resultTime != 'NaNh:NaNmin' && resultTime != false) {
            setTimeSleep(resultTime)

        } else {
            setTimeSleep("Datas inválidas!")

        }
    }

    async function loadChildId() {
        const storedId = await AsyncStorage.getItem("select_child");
        if (storedId) {
            setChildSelected(Number(storedId));
        }
    }
    loadChildId()

    const timeMaskStart = [
        /[0-2]/,
        startTime.charAt(0) === '2' ? /[0-3]/ : /[0-9]/,
        ':',
        /[0-5]/,
        /[0-9]/,
    ];

    const timeMaskEnd = [
        /[0-2]/,
        endTime.charAt(0) === '2' ? /[0-3]/ : /[0-9]/,
        ':',
        /[0-5]/,
        /[0-9]/,
    ];


    function handleRegister() {
        const fullData: RegisterSleep = {
            fk_id_child: childrenSelected,
            description: description,
            end_time: DateUtils.convertISO(endTime),
            start_time: DateUtils.convertISO(startTime)
        }

        onRegisterSleep(
            fullData
        )
    }


    useEffect(() => {
        calculateTimeSleep()
    }, [startTime, endTime])

    return (
        <ScrollView className="w-full min-h-full">
            <View className="flex w-full">
            </View>

            <View className="flex flex-col justify-between w-full h-full gap-6 p-4">
                <View className="flex flex-col mb-4">
                    <Text className={labelClassName}>Hora de início</Text>
                    <MaskInput
                        onChangeText={(e) => setStartTime(e)}
                        keyboardType="numeric"
                        mask={timeMaskStart}
                        value={startTime}
                        placeholder="00:00"
                        className={inputClassName}
                    />
                </View>
                <View className="flex flex-col mb-4">
                    <Text className={labelClassName}>Hora de término</Text>
                    <MaskInput
                        onChangeText={(e) => setEndTime(e)}
                        keyboardType="numeric"
                        mask={timeMaskEnd}
                        value={endTime}
                        placeholder="00:00"
                        className={inputClassName}
                    />
                </View>
                <View className="flex flex-col mb-4">
                    <Text className={labelClassName}>Tempo de soneca</Text>
                    <InputDefault
                        editable={false}
                        onChangeText={setTimeSleep}
                        value={timeSleep}
                        placeholder="00:00"
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