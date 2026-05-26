import React, { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { addDays, isSameDay, subDays } from 'date-fns';


import Date from '../../../src/utils/Date';

import ChildrenSelect from "../../../src/components/ChildrenSelect";

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

interface IconsRoutine {
    id: number
    name: string
    image: any
    imageDesktop: any
    description: string
    path: string
}

export interface RoutineData {
    id: number
    date: string
    hours?: string
    type: string
    title?: string
    description: string | null
    asClicked?: boolean
    imageDesk?: any
    end_time?: string
    start_time?: string
    time?: string
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

    const [childrenSelected, setChildSelected] =
        useState<number>(1)

    const [routineData, setRoutineData] =
        useState<RoutineData[]>([
            {
                "id": 1,
                "date": "2026-04-01",
                "hours": "11:36",
                "type": "alimentacao",
                "title": "Alimento sólido(Maçã)",
                "description": null
            },
            {
                "id": 2,
                "date": "2026-04-01",
                "hours": "14:36",
                "type": "fralda",
                "title": "Fralda(Xixi)",
                "description": null
            },
            {
                "id": 3,
                "date": "2026-04-01",
                "hours": "19:36",
                "type": "alimentacao",
                "title": "Leite e derivados",
                "description": "Nova fórmula utilizada na alimentação. O bebê se adaptou sem dificuldades ou resistências."
            },
            {
                "id": 4,
                "title": "Hora da soneca",
                "date": "2026-08-09",
                "hours": "11:38",
                "type": "sono",
                "end_time": "12:56",
                "time": "01:18:00",
                "description": null
            },
            {
                "id": 5,
                "title": "Hora da soneca",
                "date": "2026-08-09",
                "hours": "15:38",
                "type": "sono",
                "end_time": "16:06",
                "time": "01:28:00",
                "description": "Acordou algumas vezes chorando"
            }
        ])

    const [hourRoutine, setHourRoutine] =
        useState<string>("")

    const [visibilityTrash, setVisibilityTrash] =
        useState<boolean>(true)

    const [dayFunction, setDayFunction] =
        useState<Date>()

    const [dayFilterRotine, setDayFilterRotine] =
        useState<string>("")

    const [countFooding, setCountFooding] =
        useState<number>(0)

    const [countSleep, setCountSleep] =
        useState<string>("")

    const [countShower, setCountShower] =
        useState<number>(0)

    const [countDiaper, setCountDiaper] =
        useState<number>(0)

    function addClickedArray(routine: RoutineData[]) {

        const newRoutine: RoutineData[] =
            routine.map((it) => {

                it.asClicked = false

                return it
            })

        addIconArray(newRoutine)
    }

    function addIconArray(routine: RoutineData[]) {

        const newRoutine: RoutineData[] =
            routine.map((it) => {

                if (it.type == "banho") {

                    it.imageDesk = IconShowerDesktop

                    return it

                } else if (it.type == "fralda") {

                    it.imageDesk = IconDiaperDesktop

                    return it

                } else if (it.type == "alimentacao") {

                    it.imageDesk = IconFeedingDesktop

                    return it

                } else if (it.type == "remedio") {

                    it.imageDesk = IconMedicineDesktop

                    return it

                } else if (it.type == "sono") {

                    it.imageDesk = IconSleepDesktop

                    return it
                }

                return it
            })

        setRoutineData(newRoutine)
    }

    function onClickedCard(id: number) {

        const newRoutine: RoutineData[] =
            routineData.map((it) => {

                if (it.id == id) {

                    it.asClicked = !it.asClicked
                }

                return it
            })

        setRoutineData(newRoutine)
    }

    function countRoutineResume(routines: RoutineData[]) {

        let sleepCount: number = 0

        const counts = {
            alimentacao: 0,
            fralda: 0,
            banho: 0
        }

        routines.forEach((routine) => {

            if (routine.type == "alimentacao") {

                counts.alimentacao++

            } else if (routine.type == "fralda") {

                counts.fralda++

            } else if (routine.type == "banho") {

                counts.banho++

            } else if (routine.type == "sono") {

                if (
                    routine.time != null ||
                    routine.time != undefined
                ) {

                    let [h, m, s] =
                        routine.time.split(":").map(Number)

                    h = h * 3600
                    m = m * 60

                    sleepCount =
                        sleepCount + h + m + s
                }
            }
        })

        const hours =
            Math.floor(sleepCount / 3600)

        const minutes =
            Math.floor((sleepCount % 3600) / 60)

        const seconds =
            Math.floor(sleepCount % 60)

        const format = (n: number) =>
            String(n).padStart(2, "0")

        const sleepTime: string =
            `${format(hours)}:${format(minutes)}:${format(seconds)}`

        setCountFooding(counts.alimentacao)
        setCountDiaper(counts.fralda)
        setCountShower(counts.banho)
        setCountSleep(sleepTime)
    }

    function dateRoutine(operator: 'more' | 'less') {

        if (dayFunction) {

            if (
                operator == 'more' &&
                !isSameDay(Date.date, dayFunction)
            ) {

                setDayFunction(addDays(dayFunction, 1))

                setDayFilterRotine(
                    Date.calculateDaysFormated(
                        dayFunction,
                        operator
                    )
                )

            } else if (operator == 'less') {

                setDayFunction(subDays(dayFunction, 1))

                setDayFilterRotine(
                    Date.calculateDaysFormated(
                        dayFunction,
                        operator
                    )
                )
            }
        }
    }

    function onDeleteCard(id: number) {

        const newRoutine: RoutineData[] =
            routineData.filter(
                (it: RoutineData) => it.id != id
            )

        setRoutineData(newRoutine)

        countRoutineResume(newRoutine)
    }

    function valideVisibilityTrash() {

        const today: string[] =
            Date.getDateUTC().split("T")

        today[0] == hourRoutine
            ? setVisibilityTrash(true)
            : setVisibilityTrash(false)
    }

    useEffect(() => {

        addClickedArray(routineData)

        countRoutineResume(routineData)

        setDayFunction(Date.date)

        setDayFilterRotine(Date.getDateFormated())

    }, [])

    useEffect(() => {

        if (dayFunction) {

            if (!isSameDay(Date.date, dayFunction)) {

                setVisibilityTrash(false)

            } else {

                setVisibilityTrash(true)
            }
        }

    }, [dayFunction])

    return (

        <ScrollView
            className="flex flex-col w-screen
            xl:w-full"
        >

            <View
                className="w-full h-11
                xl:flex xl:justify-between xl:h-15"
            >

                <ChildrenSelect
                    idChild={childrenSelected}
                    setChild={setChildSelected}
                />

                <View
                    className="relative flex gap-1 w-full h-14 text-lilas-dark rounded-2xl border-2 shadow-purple-sm border-primary-darker
                    xl:w-67 xl:h- xl:border-0 xl:justify-center"
                >

                    <View
                        className="hidden xl:absolute xl:flex xl:justify-around xl:items-center xl:w-full xl:h-full xl:rounded-2xl xl:bg-white"
                    >

                        <TouchableOpacity
                            onPress={() =>
                                dateRoutine('less')
                            }
                        >

                            <SetBlack />

                        </TouchableOpacity>

                        <Text
                            className="xl:flex xl:justify-center xl:items-center xl:w-52 xl:h-full xl:text-black xl:font-bold xl:text-[14px]"
                        >

                            {dayFilterRotine}

                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                dateRoutine('more')
                            }
                        >

                            <View className="rotate-180">

                                <SetBlack />

                            </View>

                        </TouchableOpacity>

                    </View>

                    <TextInput
                        onChange={(e: any) =>
                            setHourRoutine(e.target.value)
                        }
                        value={hourRoutine}
                        className="w-[calc(100%-30px)] pl-2
                        xl:w-[55%] xl:font-bold"
                    />

                    <TouchableOpacity
                        onPress={() =>
                            valideVisibilityTrash()
                        }
                    >

                        <Search
                            width={16}
                            height={16}
                        />

                    </TouchableOpacity>

                </View>

            </View>

            <View
                className="flex flex-col
                xl:flex-row-reverse xl:justify-between xl:w-full xl:h-[calc(100%-60px)] xl:pt-5"
            >

                <View
                    className="flex flex-col
                    xl:w-[45%] xl:justify-between"
                >

                    <View
                        className="mt-8
                        md:mt-5
                        xl:flex xl:flex-col xl:justify-evenly xl:w-full xl:h-[45%] xl:rounded-sm xl:bg-primary xl:font-poppins"
                    >

                        <Text
                            className="hidden xl:flex xl:justify-center xl:w-full xl:text-white xl:font-bold xl:text-[2rem]"
                        >

                            Novo Registro

                        </Text>

                        <View
                            className="flex justify-between w-full h-22
                                xl:w-full xl:h-2/3 xl:flex-wrap xl:flex-row xl:justify-center xl:gap-2 xl:px-3"
                        >

                            {iconsRoutine.map((icon) => {

                                const IconComponent = icon.image

                                return (

                                    <Link
                                        key={icon.id}
                                        href={icon.path as any}
                                        className="w-15 h-15 bg-primary rounded-lg
                                                md:h-22 md:w-22
                                                xl:w-[30%] xl:h-[34%] xl:bg-lilas xl:rounded-2xl xl:hover:bg-white xl:hover:scale-103 xl:transition xl:duration-300"
                                    >

                                        <View
                                            className="flex w-full h-full justify-center items-center
                                            xl:flex xl:flex-col xl:text-black xl:font-semibold xl:justify-evenly"
                                        >

                                            <IconComponent
                                                width={44}
                                                height={44}
                                            />

                                            <Text
                                                className="hidden xl:flex xl:justify-center xl:w-full xl:text-[80%] xl:font-semibold"
                                            >

                                                {icon.name}

                                            </Text>

                                        </View>

                                    </Link>
                                )
                            })}

                        </View>

                    </View>

                </View>

            </View>

        </ScrollView>
    )
}

export default Routines