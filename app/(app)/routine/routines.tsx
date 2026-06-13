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

import Card from "../../../src/components/routines/HourCards";

const iconsRoutine: IconsRoutine[] = [
    {
        "id": 1,
        "name": "Alimentação",
        "image": IconFeeding,
        "imageDesktop": IconFeedingDesktop,
        "description": "Icone que redireciona para a página de rotina de alimentação.",
        "path": "/routine/feeding"
    },
    {
        "id": 2,
        "name": "Sono",
        "image": IconSleep,
        "imageDesktop": IconSleepDesktop,
        "description": "Icone que redireciona para a página de rotina de sono.",
        "path": "/routine/sleep"
    },
    {
        "id": 3,
        "name": "Fraldas",
        "image": IconDiaper,
        "imageDesktop": IconDiaperDesktop,
        "description": "Icone que redireciona para a página de rotina de troca de fraldas.",
        "path": "/routine/diaper"
    },
    {
        "id": 4,
        "name": "Banho",
        "image": IconShower,
        "imageDesktop": IconShowerDesktop,
        "description": "Icone que redireciona para a página de rotina de banho.",
        "path": "/routine/shower"
    },
    {
        "id": 5,
        "name": "Medicamentos",
        "image": IconMedicine,
        "imageDesktop": IconMedicineDesktop,
        "description": "Icone que redireciona para a página de rotina de medicação.",
        "path": "/routine/medicine"
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
                            isFullPage={true}
                            show404Background={false}
                            onButtonClick={() => { }}
                        />
                    )}

                {!isLoading &&
                    !isError &&
                    routineData.length > 0 && (
                        <View  className="absolute top-0 left-29.5 w-1 z-70 min-h-screen h-full bg-primary">
                        </View>
                    )
                }

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
                                <Card
                                    routineData={item}
                                    visibilityTrash={
                                        visibilityTrash
                                    }
                                    onClick={
                                        onClickedCard
                                    }
                                    onDelete={
                                        onDeleteCard
                                    }
                                />
                            )}
                        />
                    )}
            </View>

        </ScrollView>
    )
}

export default Routines
