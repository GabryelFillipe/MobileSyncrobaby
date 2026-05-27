import React, { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { addDays, isSameDay, subDays } from 'date-fns';


import { InputDefault } from "@/src/components/InputDefault";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateUtils from '../../../src/utils/Date';

import IconDiaper from '../../../src/assets/routines/iconRoutineDiaper.svg';
import IconFeeding from '../../../src/assets/routines/iconRoutineFood.svg';
import IconMedicine from '../../../src/assets/routines/iconRoutineMedicine.svg';
import IconShower from '../../../src/assets/routines/iconRoutineShower.svg';
import IconSleep from '../../../src/assets/routines/iconRoutineSleep.svg';

import IconDiaperDesktop from '../../../src/assets/routines/diaperDesktopIcon.svg';
import IconFeedingDesktop from '../../../src/assets/routines/foodingDesktopIcon.svg';
import IconMedicineDesktop from '../../../src/assets/routines/medicineDesktopIcon.svg';
import IconShowerDesktop from '../../../src/assets/routines/showerDesktopIcon.svg';
import IconSleepDesktop from '../../../src/assets/routines/sleepDesktopIcon.svg';

import Search from '../../../src/assets/icons/searchLight.svg';
import SetBlack from '../../../src/assets/routines/setBlack.svg';

import { Link } from "expo-router";

export interface Routines {
    child: number
    time: string
    date: string
    duration: string
    description: string | null
    title: string
    log_type: string
    id: number
    imageDesk?: any
    asClicked?: boolean
  }

interface IconsRoutine {
    id: number
    name: string
    image: any // Alterado para any para aceitar os imports de imagem/SVG no RN
    imageDesktop: any
    description: string
    path: string
}

export interface RoutineData {
    child: number
    time: string
    date: string
    duration: string
    description: string | null
    title: string
    log_type: string
    id: number
}

const iconsRoutine: IconsRoutine[] = [
    {
        "id": 1,
        "name": "Alimentação",
        "image": IconFeeding,
        "imageDesktop": IconFeedingDesktop,
        "description": "Icone que redireciona para a página de rotina de alimentação.",
        "path": "/feeding"
    },
    {
        "id": 2,
        "name": "Sono",
        "image": IconSleep,
        "imageDesktop": IconSleepDesktop,
        "description": "Icone que redireciona para a página de rotina de sono.",
        "path": "/sleep"
    },
    {
        "id": 3,
        "name": "Fraldas",
        "image": IconDiaper,
        "imageDesktop": IconDiaperDesktop,
        "description": "Icone que redireciona para a página de rotina de troca de fraldas.",
        "path": "/diaper"
    },
    {
        "id": 4,
        "name": "Banho",
        "image": IconShower,
        "imageDesktop": IconShowerDesktop,
        "description": "Icone que redireciona para a página de rotina de banho.",
        "path": "/shower"
    },
    {
        "id": 5,
        "name": "Medicamentos",
        "image": IconMedicine,
        "imageDesktop": IconMedicineDesktop,
        "description": "Icone que redireciona para a página de rotina de medicação.",
        "path": "/medicine"
    }
]

function Routines() {
    const [idChild, setIdChild] = useState<number>(1)
    const [searchDateRoutine, setSearchDateRoutine] = useState<string>(DateUtils.getDateUTC().split("T")[0])

    const [childrenSelected, setChildSelected] = useState<number>(1)
    const [routineData, setRoutineData] = useState<Routines[]>([])
    const [hourRoutine, setHourRoutine] = useState<string>("")
    const [visibilityTrash, setVisibilityTrash] = useState<boolean>(true)
    const [dayFunction, setDayFunction] = useState<Date>()
    const [dayFilterRotine, setDayFilterRotine] = useState<string>("")
    const [countFooding, setCountFooding] = useState<number>(0)
    const [countSleep, setCountSleep] = useState<string>("")
    const [countShower, setCountShower] = useState<number>(0)
    const [countDiaper, setCountDiaper] = useState<number>(0)

    // React Native usa AsyncStorage que é assíncrono
    useEffect(() => {
        async function fetchChildId() {
            const storedChild = await AsyncStorage.getItem("select_child")
            if (storedChild) {
                setIdChild(Number(storedChild))
            }
        }
        fetchChildId()
    }, [])

    function addClickedArray(routine: Routines[]) {
        const newRoutine: RoutineData[] = routine.map((it) => {
            it.asClicked = false

            return it
        })

        addIconArray(newRoutine)

    }

    function addIconArray(routine: Routines[]) {
        const newRoutine: Routines[] = routine.map((it) => {
            if (it.log_type == "banho") {
                it.imageDesk = IconShowerDesktop
                return it

            } else if (it.log_type == "fralda") {
                it.imageDesk = IconDiaperDesktop
                return it

            } else if (it.log_type == "alimentacao") {
                it.imageDesk = IconFeedingDesktop
                return it

            } else if (it.log_type == "medicacao") {
                it.imageDesk = IconMedicineDesktop
                return it

            } else if (it.log_type == "sono") {
                it.imageDesk = IconSleepDesktop
                return it

            }

            return it
        })

        setRoutineData(newRoutine)
    }

    function onClickedCard(id: string) {
        const newRoutine: Routines[] = routineData.map((it) => {
            if (`${it.log_type}${it.id}` == id) {
                it.asClicked = !it.asClicked
            }

            return it
        })

        setRoutineData(newRoutine)
    }

    function countRoutineResume(routines: RoutineData[]) {
        let sleepCount: number = 0
        const counts = { alimentacao: 0, fralda: 0, banho: 0 }

        routines.forEach((routine) => {
            if (routine.log_type == "alimentacao") {
                counts.alimentacao++

            } else if (routine.log_type == "fralda") {
                counts.fralda++

            } else if (routine.log_type == "banho") {
                counts.banho++

            } else if (routine.log_type == "sono") {
                if (routine.duration != null || routine.duration != undefined) {
                    let [h, m, s] = routine.duration.split(":").map(Number)

                    h = h * 3600
                    m = m * 60

                    sleepCount = sleepCount + h + m + s

                }
            }
        })

        const hours = Math.floor(sleepCount / 3600)
        const minutes = Math.floor((sleepCount % 3600) / 60)
        const seconds = Math.floor(sleepCount % 60)

        const format = (n: number) => String(n).padStart(2, "0")

        const sleepTime: string = `${format(hours)}:${format(minutes)}:${format(seconds)}`

        setCountFooding(counts.alimentacao)
        setCountDiaper(counts.fralda)
        setCountShower(counts.banho)
        setCountSleep(sleepTime)
    }

    function dateRoutine(operator: 'more' | 'less') {
        if (dayFunction) {
            if (operator == 'more' && !isSameDay(DateUtils.date, dayFunction)) {
                setSearchDateRoutine(addDays(searchDateRoutine, 1).toISOString())
                setHourRoutine(addDays(searchDateRoutine, 1).toISOString().split("T")[0])

                setDayFunction(addDays(dayFunction, 1))

                setDayFilterRotine(DateUtils.calculateDaysFormated(dayFunction, operator))

            } else if (operator == 'less') {
                setSearchDateRoutine(subDays(searchDateRoutine, 1).toISOString())
                setHourRoutine(subDays(searchDateRoutine, 1).toISOString().split("T")[0])

                setDayFunction(subDays(dayFunction, 1))

                setDayFilterRotine(DateUtils.calculateDaysFormated(dayFunction, operator))

            }

        }

    }

    function valideVisibilityTrash() {
        const today: string[] = DateUtils.getDateUTC().split("T")

        today[0] == hourRoutine ? setVisibilityTrash(true) : setVisibilityTrash(false)

        changeDayInput()
    }

    function changeDayInput() {
        const dateParse: string[] = hourRoutine.split("-")
        const date: Date = new Date(Number(dateParse[0]), Number(dateParse[1]) - 1, Number(dateParse[2]))

        setDayFilterRotine(DateUtils.calculateDaysFormated(hourRoutine, 'none'))
        setDayFunction(date)
        setSearchDateRoutine(hourRoutine)
    }

    function onDeleteCard(id: string) {

    }

    useEffect(() => {
        setDayFunction(DateUtils.date)
        setDayFilterRotine(DateUtils.getDateFormated())
    }, [])

    useEffect(() => {
        if (dayFunction) {
            if (!isSameDay(DateUtils.date, dayFunction)) {

                setVisibilityTrash(false)

            } else {
                setVisibilityTrash(true)

            }
        }
    }, [dayFunction])

    return (
        <View className="flex flex-col mt-10 w-screen xl:w-full">
            <View className=" w-full h-11 flex xl:flex xl:flex-row xl:justify-between xl:h-15">
                {/* <ChildrenSelect idChild={childrenSelected} setChild={setChildSelected} /> */}

                <View className="relative flex flex-row items-center gap-1 w-full h-14 text-lilas-dark rounded-2xl border-2 shadow-purple-sm border-primary-darker xl:w-67 xl:border-0 xl:justify-center">
                    <View className="hidden xl:absolute xl:flex xl:flex-row xl:justify-around xl:items-center xl:w-full xl:h-full xl:rounded-2xl xl:bg-white">
                        <TouchableOpacity onPress={() => dateRoutine('less')}>
                            <SetBlack/>
                        </TouchableOpacity>
                        <Text className="xl:flex xl:justify-center xl:items-center xl:w-52 xl:h-full xl:text-black xl:font-bold xl:text-[14px]">
                            {dayFilterRotine}
                        </Text>
                        <TouchableOpacity onPress={() => dateRoutine('more')}>
                        <SetBlack className="rotate-180" />
                        </TouchableOpacity>
                    </View>
                    <InputDefault 
                        onChangeText={(text) => setHourRoutine(text)} 
                        value={hourRoutine} 
                        type="date" 
                        className="w-[calc(100%-30px)] pl-2 xl:w-[55%] xl:font-bold" 
                    />
                    <TouchableOpacity onPress={valideVisibilityTrash}>
                        <Search className="w-4 h-auto xl:hidden" />
                    </TouchableOpacity>
                </View>
            </View>
            <View className="hidden flex-col xl:flex-row-reverse xl:justify-between xl:w-full xl:h-[calc(100%-60px)] xl:pt-5">
                <View className="flex flex-col xl:w-[45%] xl:justify-between">
                    <View className="mt-8 md:mt-5 xl:flex xl:flex-col xl:justify-evenly xl:w-full xl:h-[45%] xl:rounded-sm xl:bg-primary xl:font-poppins">
                        <Text className="hidden xl:flex xl:justify-center xl:w-full xl:text-white xl:font-bold xl:text-[2rem]">Novo Registro</Text>
                        <View className="flex flex-row justify-between w-full h-22 xl:w-full xl:h-2/3 xl:flex-wrap xl:flex-row xl:justify-center xl:gap-2 xl:px-3">
                            {iconsRoutine.map((icon) => (
                                <Link key={icon.id} href={icon.path as any} asChild>
                                    <TouchableOpacity className="w-15 h-15 bg-primary rounded-lg md:h-22 md:w-22 xl:w-[30%] xl:h-[34%] xl:bg-lilas xl:rounded-2xl xl:hover:bg-white xl:hover:scale-103 xl:transition xl:duration-300">
                                        <View className="flex w-full h-full justify-center items-center xl:flex xl:flex-col xl:text-black xl:font-semibold xl:justify-evenly">
                     
                                            <icon.imageDesktop className="hidden xl:flex md:w-auto h-11 xl:h-[110%]" />
                                            <icon.image className="flex xl:hidden md:w-auto h-11 xl:h-[110%]" />
                                            
                                            <Text className="hidden xl:flex xl:justify-center xl:w-full xl:text-[80%] xl:font-semibold">{icon.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Link>
                            ))}
                        </View>
                    </View>
                    <View className="hidden xl:flex xl:flex-col xl:justify-between xl:w-full xl:h-[40%] xl:p-3 xl:bg-white xl:shadow-purple-md xl:rounded-2xl">
                        <Text className="xl:text-2xl xl:font-semibold xl:font-poppins">Resumo diário</Text>
                        <View className="xl:flex xl:flex-col xl:h-[80%] xl:justify-around">
                            <View className=" hidden xl:flex xl:flex-row xl:items-center xl:font-nunito xl:font-semibold xl:text-lg">
                                <IconFeedingDesktop className="xl:w-auto xl:h-8" />
                                <Text className="xl:ml-3 xl:text-[16px] font-bold">Alimentação: </Text>
                                <Text className="xl:ml-1 xl:font-extralight xl:text-[14px]">Comeu {countFooding} vez(es)</Text>
                            </View>
                            <View className="hidden xl:flex xl:flex-row xl:items-center xl:font-nunito xl:font-semibold xl:text-lg">
                                <IconSleepDesktop className="xl:w-auto xl:h-7" />
                                <Text className="xl:ml-3 xl:text-[16px] font-bold">Sono: </Text>
                                <Text className="xl:ml-1 xl:font-extralight xl:text-[14px]">Dormiu por {countSleep}</Text>
                            </View>
                            <View className="hidden xl:flex xl:flex-row xl:items-center xl:font-nunito xl:font-semibold xl:text-lg">
                                <IconShowerDesktop className="xl:w-auto xl:h-7" />
                                <Text className="xl:ml-3 xl:text-[16px] font-bold">Banho: </Text>
                                <Text className="xl:ml-1 xl:font-extralight xl:text-[14px]">Tomou banho {countShower} vez(es)</Text>
                            </View>
                            <View className="hidden xl:flex xl:flex-row xl:items-center xl:font-nunito xl:font-semibold xl:text-lg">
                                <IconDiaperDesktop className="xl:w-auto xl:h-6" />
                                <Text className="xl:ml-3 xl:text-[16px] font-bold">Troca de fraldas: </Text>
                                <Text className="xl:ml-1 xl:font-extralight xl:text-[14px]">Trocou a fralda {countDiaper} vez(es)</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ScrollView className="relative pb-39 md:mt-4 xl:w-[45%] xl:bg-lilas xl:rounded-sm xl:pb-0">
                    <View className="flex flex-col w-full gap-4 py-4 pb-8 xl:items-end xl:px-4 xl:py-6 xl:relative xl:gap-6 xl:min-h-full">
                       
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default Routines