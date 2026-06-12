// import React, { useEffect, useState } from "react";
// import {
//     ScrollView,
//     Text,
//     TouchableOpacity,
//     View
// } from "react-native";

// import { addDays, isSameDay, subDays } from 'date-fns';


// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateUtils from '../../../src/utils/Date';

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

// import { InputDefault } from "@/src/components/InputDefault";
// import Search from '../../../src/assets/icons/searchLight.svg';
// import SetBlack from '../../../src/assets/routines/setBlack.svg';


// export interface Routines {
//     child: number
//     time: string
//     date: string
//     duration: string
//     description: string | null
//     title: string
//     log_type: string
//     id: number
//     imageDesk?: any
//     asClicked?: boolean
// }

// interface IconsRoutine {
//     id: number
//     name: string
//     image: any // Alterado para any para aceitar os imports de imagem/SVG no RN
//     imageDesktop: any
//     description: string
//     path: string
// }

// export interface RoutineData {
//     child: number
//     time: string
//     date: string
//     duration: string
//     description: string | null
//     title: string
//     log_type: string
//     id: number
// }

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

import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { addDays, isSameDay, subDays } from "date-fns";
import { useRouter } from "expo-router";


import DateUtils from "../../../src/utils/Date";

import { EmptyState } from "../../../src/components/EmptyState";
import { LoadingBaby } from "../../../src/components/Loading";

import { useDeleteRoutines } from "../../../src/services/hook/routines/useDeleteRoutines";
import { useGetRoutinesByChild } from "../../../src/services/hook/routines/useGetRoutines";

import type { Routine } from "../../../src/services/routines/routines.service";

interface IconsRoutine {
    id: number;
    name: string;
    image: any;
    imageDesktop: any;
    description: string;
    path: string;
}

export interface RoutineData {
    child: number;
    time: string;
    date: string;
    duration: string;
    description: string | null;
    title: string;
    log_type: string;
    id: number;
}

function Routines() {
    const router = useRouter();

    const [idChild, setIdChild] = useState<number | null>(null);

    const [searchDateRoutine, setSearchDateRoutine] =
        useState<string>(
            DateUtils.getDateUTC().split("T")[0]
        );

    const [routineData, setRoutineData] =
        useState<Routine[]>([]);

    const [hourRoutine, setHourRoutine] =
        useState<string>(
            DateUtils.getDateUTC().split("T")[0]
        );

    const [visibilityTrash, setVisibilityTrash] =
        useState(true);

    const [dayFunction, setDayFunction] =
        useState<Date>();

    const [dayFilterRoutine, setDayFilterRoutine] =
        useState("");

    const [countFooding, setCountFooding] =
        useState(0);

    const [countSleep, setCountSleep] =
        useState("");

    const [countShower, setCountShower] =
        useState(0);

    const [countDiaper, setCountDiaper] =
        useState(0);

    const [showDatePicker, setShowDatePicker] =
        useState(false);

    const { mutate: onDeleteRoutines } =
        useDeleteRoutines();

    const {
        data: onGetRoutines,
        isLoading,
        isError,
    } = useGetRoutinesByChild(
        idChild ?? 0,
        searchDateRoutine
    );

    useEffect(() => {
        let mounted = true;

        async function loadChild() {
            try {
                const child =
                    await AsyncStorage.getItem(
                        "select_child"
                    );

                if (child && mounted) {
                    setIdChild(Number(child));
                }

            } catch {
                Alert.alert(
                    "Erro",
                    "Não foi possível recuperar a criança selecionada."
                );
            }
        }

        loadChild();

        return () => {
            mounted = false;
        };
    }, []);

    function onChangeDate(
        event: DateTimePickerEvent,
        selectedDate?: Date
    ) {
        setShowDatePicker(false);

        if (!selectedDate) {
            return;
        }

        const formatted =
            selectedDate
                .toISOString()
                .split("T")[0];

        setHourRoutine(formatted);
    }

    function addIconArray(routines: Routine[]) {
        const newRoutine = routines.map((item) => {
            let imageDesk = item.imageDesk;

            switch (item.log_type) {
                case "banho":
                    imageDesk = IconShowerDesktop;
                    break;

                case "fralda":
                    imageDesk = IconDiaperDesktop;
                    break;

                case "alimentacao":
                    imageDesk = IconFeedingDesktop;
                    break;

                case "medicacao":
                    imageDesk = IconMedicineDesktop;
                    break;

                case "sono":
                    imageDesk = IconSleepDesktop;
                    break;
            }

            return {
                ...item,
                imageDesk,
            };
        });

        setRoutineData(newRoutine);
    }

    function addClickedArray(routines: Routine[]) {
        const newRoutine = routines.map((item) => ({
            ...item,
            asClicked: false,
        }));

        addIconArray(newRoutine);
    }

    function onClickedCard(id: string) {
        setRoutineData((previous) =>
            previous.map((item) => {
                if (`${item.log_type}${item.id}` === id) {
                    return {
                        ...item,
                        asClicked: !item.asClicked,
                    };
                }

                return item;
            })
        );
    }

    function countRoutineResume(
        routines: Routine[]
    ) {
        let sleepCount = 0;

        const counts = {
            alimentacao: 0,
            fralda: 0,
            banho: 0,
        };

        routines.forEach((routine) => {
            switch (routine.log_type) {
                case "alimentacao":
                    counts.alimentacao++;
                    break;

                case "fralda":
                    counts.fralda++;
                    break;

                case "banho":
                    counts.banho++;
                    break;

                case "sono":
                    if (routine.duration) {
                        const [
                            hours,
                            minutes,
                            seconds,
                        ] = routine.duration
                            .split(":")
                            .map(Number);

                        sleepCount +=
                            hours * 3600 +
                            minutes * 60 +
                            seconds;
                    }

                    break;
            }
        });

        const hours = Math.floor(
            sleepCount / 3600
        );

        const minutes = Math.floor(
            (sleepCount % 3600) / 60
        );

        const seconds = Math.floor(
            sleepCount % 60
        );

        const format = (n: number) =>
            String(n).padStart(2, "0");

        setCountFooding(
            counts.alimentacao
        );

        setCountDiaper(
            counts.fralda
        );

        setCountShower(
            counts.banho
        );

        setCountSleep(
            `${format(hours)}:${format(
                minutes
            )}:${format(seconds)}`
        );
    }

    function dateRoutine(
        operator: "more" | "less"
    ) {
        if (!dayFunction) {
            return;
        }

        if (
            operator === "more" &&
            !isSameDay(
                DateUtils.date,
                dayFunction
            )
        ) {
            const nextDate =
                addDays(dayFunction, 1);

            setDayFunction(nextDate);

            setSearchDateRoutine(
                nextDate
                    .toISOString()
                    .split("T")[0]
            );

            setHourRoutine(
                nextDate
                    .toISOString()
                    .split("T")[0]
            );

            setDayFilterRoutine(
                DateUtils.calculateDaysFormated(
                    dayFunction,
                    operator
                )
            );

        } else if (
            operator === "less"
        ) {
            const previousDate =
                subDays(dayFunction, 1);

            setDayFunction(
                previousDate
            );

            setSearchDateRoutine(
                previousDate
                    .toISOString()
                    .split("T")[0]
            );

            setHourRoutine(
                previousDate
                    .toISOString()
                    .split("T")[0]
            );

            setDayFilterRoutine(
                DateUtils.calculateDaysFormated(
                    dayFunction,
                    operator
                )
            );
        }
    }

    function changeDayInput() {
        const dateParts =
            hourRoutine.split("-");

        const date = new Date(
            Number(dateParts[0]),
            Number(dateParts[1]) - 1,
            Number(dateParts[2])
        );

        setDayFilterRoutine(
            DateUtils.calculateDaysFormated(
                hourRoutine,
                "none"
            )
        );

        setDayFunction(date);

        setSearchDateRoutine(
            hourRoutine
        );
    }

    function valideVisibilityTrash() {
        const today =
            DateUtils.getDateUTC()
                .split("T")[0];

        setVisibilityTrash(
            today === hourRoutine
        );

        changeDayInput();
    }

    function onDeleteCard(id: string) {
        const values =
            id.split("/");

        let type = "";

        switch (values[0]) {
            case "sono":
                type = "sleep";
                break;

            case "banho":
                type = "bath";
                break;

            case "alimentacao":
                type = "feeding";
                break;

            case "fralda":
                type = "diaper";
                break;

            case "medicacao":
                type = "medication";
                break;
        }

        onDeleteRoutines(
            {
                id_register: Number(
                    values[1]
                ),
                type,
            },
            {
                onSuccess: () => {
                    const newRoutine =
                        routineData.filter(
                            (item) =>
                                `${item.log_type}/${item.id}` !==
                                id
                        );

                    setRoutineData(
                        newRoutine
                    );

                    countRoutineResume(
                        newRoutine
                    );
                },

                onError: () => {
                    Alert.alert(
                        "Erro",
                        "Erro ao deletar rotina."
                    );
                },
            }
        );
    }

    useEffect(() => {
        setDayFunction(DateUtils.date);
        setDayFilterRoutine(
            DateUtils.getDateFormated()
        );
    }, []);

    useEffect(() => {
        if (!dayFunction) {
            return;
        }

        setVisibilityTrash(
            isSameDay(
                DateUtils.date,
                dayFunction
            )
        );
    }, [dayFunction]);

    useEffect(() => {
        if (!onGetRoutines) {
            return;
        }

        countRoutineResume(
            onGetRoutines.routines
        );

        addClickedArray(
            onGetRoutines.routines
        );
    }, [onGetRoutines]);

    useEffect(() => {
        if (!hourRoutine) {
            return;
        }

        valideVisibilityTrash();
    }, [hourRoutine]);

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{
                paddingBottom: 32,
            }}
            showsVerticalScrollIndicator={false}
        >
            <View className="w-full px-4 mt-2">
                <View
                    className="
            flex-row
            items-center
            justify-between
            bg-white
            rounded-2xl
            px-3
            py-3
            shadow-sm
        "
                >
                    <TouchableOpacity
                        onPress={() =>
                            dateRoutine("less")
                        }
                    >
                        <Text
                            className="
                    text-xl
                    font-bold
                "
                        >
                            {"<"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            setShowDatePicker(true)
                        }
                    >
                        <Text
                            className="
                    text-base
                    font-semibold
                    text-center
                "
                        >
                            {dayFilterRoutine}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            dateRoutine("more")
                        }
                    >
                        <Text
                            className="
                    text-xl
                    font-bold
                "
                        >
                            {">"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={
                        new Date(hourRoutine)
                    }
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}
            <View className="px-4 mt-6">
                <View
                    className="
        flex justify-between flex-row w-full h-22
    "
                >
                    <Text
                        className="
                        hidden
            text-white
            text-xl
            font-bold
            text-center
            mb-4
            xl:block
        "
                    >
                        Novo Registro
                    </Text>

                    <View
                        className="
            flex justify-between flex-row w-full h-22
        "
                    >
                        {iconsRoutine.map(
                            (icon) => (
                                <TouchableOpacity
                                    key={icon.id}
                                    onPress={() =>
                                        router.push(
                                            icon.path as any
                                        )
                                    }
                                    className="
                        justify-center items-center w-18 h-18 bg-primary rounded-lg flex
                    "
                                >
                                    <icon.image

                                        resizeMode="contain"
                                        className="
                            w-12
                            h-12
                        "
                                    />
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                    <View
                        className="
                         hidden
        mt-6
        bg-white
        rounded-2xl
        p-4
        xl:block
    "
                    >
                        <Text
                            className="
            text-xl
            font-bold
            mb-4
        "
                        >
                            Resumo diário
                        </Text>

                        <Text>
                            Alimentação:
                            {" "}
                            Comeu {countFooding} vez(es)
                        </Text>

                        <Text className="mt-2">
                            Sono:
                            {" "}
                            Dormiu por {countSleep}
                        </Text>

                        <Text className="mt-2">
                            Banho:
                            {" "}
                            Tomou banho {countShower} vez(es)
                        </Text>

                        <Text className="mt-2">
                            Fraldas:
                            {" "}
                            Trocou a fralda {countDiaper} vez(es)
                        </Text>
                    </View>
                </View>
            </View>
            <View
                className="
        mt-6
        rounded-2xl
        bg-lilas
        p-4
    "
            >
                {isLoading && (
                    <LoadingBaby
                        message="Buscando rotinas"
                    />
                )}
                {!isLoading && isError && (
                    <Text
                        className="
            text-center
            text-red-500
            font-semibold
        "
                    >
                        Erro ao carregar a API
                    </Text>
                )}
                {!isLoading &&
                    !isError &&
                    onGetRoutines?.routines.length === 0 && (
                        <EmptyState
                            title="Está tudo tão calmo..."
                            description="Parece que nenhuma rotina foi cadastrada nesse dia."
                            buttonText="Registre uma rotina"
                            isFullPage={false}
                            show404Background={false}
                            onButtonClick={() => { }}
                        />
                    )}
                {!isLoading &&
                    !isError &&
                    routineData.length > 0 && (
                        <View
                            style={{
                                position: "absolute",
                                left: 28,
                                top: 20,
                                bottom: 20,
                                width: 4,
                                borderRadius: 2,
                                backgroundColor: "#5A3E8E",
                            }}
                        />
                    )}

                {!isLoading &&
                    !isError &&
                    routineData.length > 0 && (
                        <FlatList
                            data={routineData}
                            keyExtractor={(item) =>
                                `${item.log_type}${item.id}`
                            }
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                // <Card
                                //     routineData={item}
                                //     visibilityTrash={
                                //         visibilityTrash
                                //     }
                                //     onClick={
                                //         onClickedCard
                                //     }
                                //     onDelete={
                                //         onDeleteCard
                                //     }
                                // />
                                <View></View>
                            )}
                            ItemSeparatorComponent={() => (
                                <View
                                    style={{
                                        height: 24,
                                    }}
                                />
                            )}
                        />
                    )}
            </View>

        </ScrollView>
    )
    // const [idChild, setIdChild] = useState<number>(1)
    // const [searchDateRoutine, setSearchDateRoutine] = useState<string>(DateUtils.getDateUTC().split("T")[0])

    // const [childrenSelected, setChildSelected] = useState<number>(1)
    // const [routineData, setRoutineData] = useState<Routines[]>([])
    // const [hourRoutine, setHourRoutine] = useState<string>("")
    // const [visibilityTrash, setVisibilityTrash] = useState<boolean>(true)
    // const [dayFunction, setDayFunction] = useState<Date>()
    // const [dayFilterRotine, setDayFilterRotine] = useState<string>("")
    // const [countFooding, setCountFooding] = useState<number>(0)
    // const [countSleep, setCountSleep] = useState<string>("")
    // const [countShower, setCountShower] = useState<number>(0)
    // const [countDiaper, setCountDiaper] = useState<number>(0)

    // // React Native usa AsyncStorage que é assíncrono
    // useEffect(() => {
    //     async function fetchChildId() {
    //         const storedChild = await AsyncStorage.getItem("select_child")
    //         if (storedChild) {
    //             setIdChild(Number(storedChild))
    //         }
    //     }
    //     fetchChildId()
    // }, [])

    // function addClickedArray(routine: Routines[]) {
    //     const newRoutine: RoutineData[] = routine.map((it) => {
    //         it.asClicked = false

    //         return it
    //     })

    //     addIconArray(newRoutine)

    // }

    // function addIconArray(routine: Routines[]) {
    //     const newRoutine: Routines[] = routine.map((it) => {
    //         if (it.log_type == "banho") {
    //             it.imageDesk = IconShowerDesktop
    //             return it

    //         } else if (it.log_type == "fralda") {
    //             it.imageDesk = IconDiaperDesktop
    //             return it

    //         } else if (it.log_type == "alimentacao") {
    //             it.imageDesk = IconFeedingDesktop
    //             return it

    //         } else if (it.log_type == "medicacao") {
    //             it.imageDesk = IconMedicineDesktop
    //             return it

    //         } else if (it.log_type == "sono") {
    //             it.imageDesk = IconSleepDesktop
    //             return it

    //         }

    //         return it
    //     })

    //     setRoutineData(newRoutine)
    // }

    // function onClickedCard(id: string) {
    //     const newRoutine: Routines[] = routineData.map((it) => {
    //         if (`${it.log_type}${it.id}` == id) {
    //             it.asClicked = !it.asClicked
    //         }

    //         return it
    //     })

    //     setRoutineData(newRoutine)
    // }

    // function countRoutineResume(routines: RoutineData[]) {
    //     let sleepCount: number = 0
    //     const counts = { alimentacao: 0, fralda: 0, banho: 0 }

    //     routines.forEach((routine) => {
    //         if (routine.log_type == "alimentacao") {
    //             counts.alimentacao++

    //         } else if (routine.log_type == "fralda") {
    //             counts.fralda++

    //         } else if (routine.log_type == "banho") {
    //             counts.banho++

    //         } else if (routine.log_type == "sono") {
    //             if (routine.duration != null || routine.duration != undefined) {
    //                 let [h, m, s] = routine.duration.split(":").map(Number)

    //                 h = h * 3600
    //                 m = m * 60

    //                 sleepCount = sleepCount + h + m + s

    //             }
    //         }
    //     })

    //     const hours = Math.floor(sleepCount / 3600)
    //     const minutes = Math.floor((sleepCount % 3600) / 60)
    //     const seconds = Math.floor(sleepCount % 60)

    //     const format = (n: number) => String(n).padStart(2, "0")

    //     const sleepTime: string = `${format(hours)}:${format(minutes)}:${format(seconds)}`

    //     setCountFooding(counts.alimentacao)
    //     setCountDiaper(counts.fralda)
    //     setCountShower(counts.banho)
    //     setCountSleep(sleepTime)
    // }

    // function dateRoutine(operator: 'more' | 'less') {
    //     if (dayFunction) {
    //         if (operator == 'more' && !isSameDay(DateUtils.date, dayFunction)) {
    //             setSearchDateRoutine(addDays(searchDateRoutine, 1).toISOString())
    //             setHourRoutine(addDays(searchDateRoutine, 1).toISOString().split("T")[0])

    //             setDayFunction(addDays(dayFunction, 1))

    //             setDayFilterRotine(DateUtils.calculateDaysFormated(dayFunction, operator))

    //         } else if (operator == 'less') {
    //             setSearchDateRoutine(subDays(searchDateRoutine, 1).toISOString())
    //             setHourRoutine(subDays(searchDateRoutine, 1).toISOString().split("T")[0])

    //             setDayFunction(subDays(dayFunction, 1))

    //             setDayFilterRotine(DateUtils.calculateDaysFormated(dayFunction, operator))

    //         }

    //     }

    // }

    // function valideVisibilityTrash() {
    //     const today: string[] = DateUtils.getDateUTC().split("T")

    //     today[0] == hourRoutine ? setVisibilityTrash(true) : setVisibilityTrash(false)

    //     changeDayInput()
    // }

    // function changeDayInput() {
    //     const dateParse: string[] = hourRoutine.split("-")
    //     const date: Date = new Date(Number(dateParse[0]), Number(dateParse[1]) - 1, Number(dateParse[2]))

    //     setDayFilterRotine(DateUtils.calculateDaysFormated(hourRoutine, 'none'))
    //     setDayFunction(date)
    //     setSearchDateRoutine(hourRoutine)
    // }

    // function onDeleteCard(id: string) {

    // }

    // useEffect(() => {
    //     setDayFunction(DateUtils.date)
    //     // setDayFilterRotine(DateUtils.getDateFormated())
    // }, [])

    // useEffect(() => {
    //     if (dayFunction) {
    //         if (!isSameDay(DateUtils.date, dayFunction)) {

    //             setVisibilityTrash(false)

    //         } else {
    //             setVisibilityTrash(true)

    //         }
    //     }
    // }, [dayFunction])

    // return (
    //     <View className="flex px-6 flex-col xl:w-full">
    //         <View className="w-full h-11 xl:flex xl:justify-between xl:h-15">
    //             <View className="relative flex gap-1 w-full h-14 text-lilas-dark rounded-2xl border-2 shadow-purple-sm border-primary-darker xl:w-67 xl:h- xl:border-0 xl:justify-center">
    //                 <View className="hidden xl:absolute xl:flex xl:justify-around xl:items-center xl:w-full xl:h-full xl:rounded-2xl xl:bg-white">
    //                     <TouchableOpacity onPress={() => dateRoutine('less')}>
    //                         <SetBlack accessibilityLabel="Icone para voltar um dia na rotina." />
    //                     </TouchableOpacity>
    //                     <Text className="xl:flex xl:justify-center xl:items-center xl:w-52 xl:h-full xl:text-black xl:font-bold xl:text-[14px]">{dayFilterRotine}</Text>
    //                     <TouchableOpacity onPress={() => dateRoutine('more')}>
    //                         <SetBlack accessibilityLabel="Icone para avançar um dia na rotina." className="rotate-180" />
    //                     </TouchableOpacity>
    //                 </View>
    //                 <InputDefault onChangeText={setHourRoutine} value={hourRoutine} type="date" className="w-[calc(100%-30px)] pl-2 xl:w-[55%] xl:font-bold" />
    //                 <TouchableOpacity onPress={valideVisibilityTrash}>
    //                     <Search accessibilityLabel="Icone de busca para pesquisar uma rotina específica pela data." className="w-4 h-auto xl:hidden" />
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //         <View className="flex flex-col xl:flex-row-reverse xl:justify-between xl:w-full xl:h-[calc(100%-60px)] xl:pt-5">
    //             <View className="flex flex-col xl:w-[45%] xl:justify-between">
    //                 <View className="mt-8 md:mt-5 xl:flex xl:flex-col xl:justify-evenly xl:w-full xl:h-[45%] xl:rounded-sm xl:bg-primary xl:font-poppins">
    //                     <Text className="hidden xl:flex xl:justify-center xl:w-full xl:text-white xl:font-bold xl:text-[2rem]">Novo Registro</Text>
    //                     <View className=" flex-row justify-between w-full h-22 xl:w-full xl:h-2/3 xl:flex-wrap xl:flex-row xl:justify-center xl:gap-2 xl:px-3">
    //                         {iconsRoutine.map((icon) => (
    //                             <TouchableOpacity key={icon.id} onPress={() => {/* Adicione aqui a lógica do router nativo com icon.path */ }} className="w-15 h-15 bg-primary rounded-lg md:h-22 md:w-22 xl:w-[30%] xl:h-[34%] xl:bg-lilas xl:rounded-2xl xl:hover:bg-white xl:hover:scale-103 xl:transition xl:duration-300">
    //                                 <View className="flex w-full h-full justify-center items-center xl:flex xl:flex-col xl:text-black xl:font-semibold xl:justify-evenly">
    //                                     <icon.image accessibilityLabel={icon.description} className="md:w-auto h-11 xl:h-[110%]" />
    //                                     <Text className="hidden xl:flex xl:justify-center xl:w-full xl:text-[80%] xl:font-semibold">{icon.name}</Text>
    //                                 </View>
    //                             </TouchableOpacity>
    //                         ))}
    //                     </View>
    //                 </View>
    //                 <View className="hidden xl:flex xl:flex-col xl:justify-between xl:w-full xl:h-[40%] xl:p-3 xl:bg-white xl:shadow-purple-md xl:rounded-2xl">
    //                     <Text className="xl:text-2xl xl:font-semibold xl:font-poppins">Resumo diário</Text>
    //                     <View className="xl:flex xl:flex-col xl:h-[80%] xl:justify-around">
    //                         <View className="xl:flex xl:items-center xl:font-nunito xl:font-semibold xl:text-lg">
    //                             <IconFeedingDesktop accessible={false} className="xl:w-auto xl:h-8" />
    //                             <Text className="xl:ml-3 xl:text-[16px]">Alimentação: </Text>
    //                             <Text className="xl:ml-1 xl:font-extralight xl:text-[14px]">Comeu {countFooding} vez(es)</Text>
    //                         </View>
    //                         <View className="xl:flex xl:items-center xl:font-nunito xl:font-semibold xl:text-lg">
    //                             <IconSleepDesktop accessible={false} className="xl:w-auto xl:h-7" />
    //                             <Text className="xl:ml-3 xl:text-[16px]">Sono: </Text>
    //                             <Text className="xl:ml-1 xl:font-extralight xl:text-[14px]">Dormiu por {countSleep}</Text>
    //                         </View>
    //                         <View className="xl:flex xl:items-center xl:font-nunito xl:font-semibold xl:text-lg">
    //                             <IconShowerDesktop accessible={false} className="xl:w-auto xl:h-7" />
    //                             <Text className="xl:ml-3 xl:text-[16px]">Banho: </Text>
    //                             <Text className="xl:ml-1 xl:font-extralight xl:text-[14px]">Tomou banho {countShower} vez(es)</Text>
    //                         </View>
    //                         <View className="xl:flex xl:items-center xl:font-nunito xl:font-semibold xl:text-lg">
    //                             <IconDiaperDesktop accessible={false} className="xl:w-auto xl:h-6" />
    //                             <Text className="xl:ml-3 xl:text-[16px]">Troca de fraldas: </Text>
    //                             <Text className="xl:ml-1 xl:font-extralight xl:text-[14px]">Trocou a fralda {countDiaper} vez(es)</Text>
    //                         </View>
    //                     </View>
    //                 </View>
    //             </View>
    //             <ScrollView className="relative bg-accent pb-39 md:mt-4 xl:w-[45%] xl:bg-lilas xl:rounded-sm xl:pb-0">
    //                 <View className="flex flex-col w-full gap-4 py-4 pb-8 xl:items-end xl:px-4 xl:py-6 xl:relative xl:gap-6 xl:min-h-full">
    //                     {/* {isLoading && <LoadingBaby text="Buscando rotinas" />}

    //                     {!isLoading && isError &&
    //                         <Text className="text-red-500 font-poppins col-span-full text-center mt-4">
    //                             Erro ao carregar a API
    //                         </Text>
    //                     }

    //                     {!isLoading && !isError && onGetRoutines?.routines.length == 0 &&
    //                         <EmptyState
    //                             title="Está tudo tão calmo..."
    //                             description="Parece que nenhuma rotina foi cadastrada nesse dia."
    //                             buttonText="Registre uma rotina ao lado"
    //                             isFullPage={false}
    //                             show404Background={false}
    //                             onButtonClick={() => { }}
    //                         ></EmptyState>
    //                     }

    //                     {!isLoading && !isError && onGetRoutines!.routines.length > 0 &&
    //                         (
    //                             <>
    //                                 <View className="absolute top-0 left-26 w-1 min-h-[55dvh] h-full bg-primary md:min-h-[70dvh] md:left-38 xl:min-h-full xl:bg-white xl:left-[calc(9%+20px)]"></View>
    //                                 {routineData.map((routine) => (
    //                                     <Card key={`${routine.log_type}${routine.id}`} routineData={routine} visibilityTrash={visibilityTrash} onClick={onClickedCard} onDelete={onDeleteCard} />
    //                                 ))}
    //                             </>
    //                         )
    //                     } */}
    //                 </View>
    //             </ScrollView>
    //         </View>
    //     </View>
    // )
}

export default Routines
