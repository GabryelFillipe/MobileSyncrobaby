import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { addDays, isSameDay, subDays } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import IconDiaper from "../../../src/assets/routines/iconRoutineDiaper.svg";
import IconFeeding from "../../../src/assets/routines/iconRoutineFood.svg";
import IconMedicine from "../../../src/assets/routines/iconRoutineMedicine.svg";
import IconShower from "../../../src/assets/routines/iconRoutineShower.svg";
import IconSleep from "../../../src/assets/routines/iconRoutineSleep.svg";

import { EmptyState } from "../../../src/components/EmptyState";
import { LoadingBaby } from "../../../src/components/Loading";
import Card from "../../../src/components/routines/HourCards";

import { useDeleteRoutines } from "../../../src/services/hook/routines/useDeleteRoutines";
import { useGetRoutinesByChild } from "../../../src/services/hook/routines/useGetRoutines";
import type { Routine } from "../../../src/services/routines/routines.service";
import DateUtils from "../../../src/utils/Date";

interface IconsRoutine {
  id: number;
  name: string;
  image: any;
  description: string;
  path: string;
}

export interface RoutineData extends Routine {
  imageDesk?: any;
  asClicked?: boolean;
}

const iconsRoutine: IconsRoutine[] = [
  {
    id: 1,
    name: "Alimentação",
    image: IconFeeding,
    description:
      "Icone que redireciona para a página de rotina de alimentação.",
    path: "/(app)/routine/feeding",
  },
  {
    id: 2,
    name: "Sono",
    image: IconSleep,
    description: "Icone que redireciona para a página de rotina de sono.",
    path: "/(app)/routine/sleep",
  },
  {
    id: 3,
    name: "Fraldas",
    image: IconDiaper,
    description:
      "Icone que redireciona para a página de rotina de troca de fraldas.",
    path: "/(app)/routine/diaper",
  },
  {
    id: 4,
    name: "Banho",
    image: IconShower,
    description: "Icone que redireciona para a página de rotina de banho.",
    path: "/(app)/routine/shower",
  },
  {
    id: 5,
    name: "Medicamentos",
    image: IconMedicine,
    description: "Icone que redireciona para a página de rotina de medicação.",
    path: "/(app)/routine/medicine",
  },
];

function Routines() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [idChild, setIdChild] = useState<number | null>(null);
  const [searchDateRoutine, setSearchDateRoutine] = useState<string>(
    DateUtils.getDateUTC().split("T")[0],
  );
  const [routineData, setRoutineData] = useState<RoutineData[]>([]);
  const [hourRoutine, setHourRoutine] = useState<string>(
    DateUtils.getDateUTC().split("T")[0],
  );
  const [visibilityTrash, setVisibilityTrash] = useState(true);
  const [dayFunction, setDayFunction] = useState<Date>();
  const [dayFilterRoutine, setDayFilterRoutine] = useState("");
  const [countFooding, setCountFooding] = useState(0);
  const [countSleep, setCountSleep] = useState("");
  const [countShower, setCountShower] = useState(0);
  const [countDiaper, setCountDiaper] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { mutate: onDeleteRoutines } = useDeleteRoutines();
  const {
    data: onGetRoutines,
    isLoading,
    isError,
  } = useGetRoutinesByChild(idChild ?? 0, searchDateRoutine);

  useEffect(() => {
    let mounted = true;
    async function loadChild() {
      try {
        const child = await AsyncStorage.getItem("select_child");
        if (child && mounted) {
          setIdChild(Number(child));
        }
      } catch {
        Alert.alert(
          "Erro",
          "Não foi possível recuperar a criança selecionada.",
        );
      }
    }
    loadChild();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setDayFunction(DateUtils.date);
    setDayFilterRoutine(DateUtils.getDateFormated());
  }, []);

  useEffect(() => {
    if (!dayFunction) return;
    setVisibilityTrash(isSameDay(DateUtils.date, dayFunction));
  }, [dayFunction]);

  useEffect(() => {
    if (onGetRoutines) {
      countRoutineResume(onGetRoutines.routines);
      addClickedArray(onGetRoutines.routines);
    }
  }, [onGetRoutines]);

  useEffect(() => {
    if (!hourRoutine) return;
    valideVisibilityTrash();
  }, [hourRoutine]);

  function onChangeDate(event: DateTimePickerEvent, selectedDate?: Date) {
    setShowDatePicker(false);
    if (!selectedDate) return;
    const formatted = selectedDate.toISOString().split("T")[0];
    setHourRoutine(formatted);
  }

  function addIconArray(routines: Routine[]) {
    const newRoutine: RoutineData[] = routines.map((item) => {
      let icon = item.imageDesk;

      if (item.log_type === "banho") {
        icon = IconShower;
      } else if (item.log_type === "fralda") {
        icon = IconDiaper;
      } else if (item.log_type === "alimentacao") {
        icon = IconFeeding;
      } else if (item.log_type === "medicacao") {
        icon = IconMedicine;
      } else if (item.log_type === "sono") {
        icon = IconSleep;
      }

      return {
        ...item,
        imageDesk: icon,
      };
    });

    return newRoutine;
  }

  function addClickedArray(routines: Routine[]) {
    const mappedWithIcons = addIconArray(routines);
    const newRoutine = mappedWithIcons.map((item) => ({
      ...item,
      asClicked: false,
    }));
    setRoutineData(newRoutine);
  }

  function onClickedCard(id: string) {
    setRoutineData((previous) =>
      previous.map((item) => {
        if (`${item.log_type}${item.id}` === id) {
          return { ...item, asClicked: !item.asClicked };
        }
        return item;
      }),
    );
  }

  function countRoutineResume(routines: Routine[]) {
    let sleepCount = 0;
    const counts = { alimentacao: 0, fralda: 0, banho: 0 };

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
            const [hours, minutes, seconds] = routine.duration
              .split(":")
              .map(Number);
            sleepCount += hours * 3600 + minutes * 60 + seconds;
          }
          break;
      }
    });

    const hours = Math.floor(sleepCount / 3600);
    const minutes = Math.floor((sleepCount % 3600) / 60);
    const seconds = Math.floor(sleepCount % 60);
    const format = (n: number) => String(n).padStart(2, "0");

    setCountFooding(counts.alimentacao);
    setCountDiaper(counts.fralda);
    setCountShower(counts.banho);
    setCountSleep(`${format(hours)}:${format(minutes)}:${format(seconds)}`);
  }

  function dateRoutine(operator: "more" | "less") {
    if (!dayFunction) return;

    if (operator === "more" && !isSameDay(DateUtils.date, dayFunction)) {
      const nextDate = addDays(dayFunction, 1);
      setDayFunction(nextDate);
      setSearchDateRoutine(nextDate.toISOString().split("T")[0]);
      setHourRoutine(nextDate.toISOString().split("T")[0]);
      setDayFilterRoutine(
        DateUtils.calculateDaysFormated(dayFunction, operator),
      );
    } else if (operator === "less") {
      const previousDate = subDays(dayFunction, 1);
      setDayFunction(previousDate);
      setSearchDateRoutine(previousDate.toISOString().split("T")[0]);
      setHourRoutine(previousDate.toISOString().split("T")[0]);
      setDayFilterRoutine(
        DateUtils.calculateDaysFormated(dayFunction, operator),
      );
    }
  }

  function valideVisibilityTrash() {
    const today = DateUtils.getDateUTC().split("T")[0];
    setVisibilityTrash(today === hourRoutine);
    const dateParts = hourRoutine.split("-");
    const date = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2]),
    );
    setDayFilterRoutine(DateUtils.calculateDaysFormated(hourRoutine, "none"));
    setDayFunction(date);
    setSearchDateRoutine(hourRoutine);
  }

  function onDeleteCard(id: string) {
    const values = id.split("/");
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
      { id_register: Number(values[1]), type },
      {
        onSuccess: () => {
          const newRoutine = routineData.filter(
            (item) => `${item.log_type}/${item.id}` !== id,
          );
          setRoutineData(newRoutine);
          countRoutineResume(newRoutine);
        },
        onError: () => {
          Alert.alert("Erro", "Erro ao deletar rotina.");
        },
      },
    );
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 bg-light px-4"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full mt-4">
        <View className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
          <TouchableOpacity
            onPress={() => dateRoutine("less")}
            className="px-2"
          >
            <Text className="text-xl font-bold text-primary-text">{"<"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text className="text-base font-semibold text-center text-primary-text">
              {dayFilterRoutine}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => dateRoutine("more")}
            className="px-2"
          >
            <Text className="text-xl font-bold text-primary-text">{">"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(hourRoutine)}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <View className="mt-6 ">
        <View className="bg-white rounded-2xl p-4 flex-row justify-between w-full shadow-md">
          {iconsRoutine.map((icon) => {
            const IconComponent = icon.image;
            return (
              <TouchableOpacity
                key={icon.id}
                onPress={() => router.push(icon.path as any)}
                className="justify-center items-center bg-primary rounded-xl w-14 h-14 shadow-sm"
              >
                <IconComponent width={32} height={32} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <Text className="text-xl font-bold mb-4 text-primary-text">
            Resumo diário
          </Text>
          <Text className="text-primary-darker font-nunito mb-2">
            <Text className="font-bold">Alimentação:</Text> Comeu {countFooding}{" "}
            vez(es)
          </Text>
          <Text className="text-primary-darker font-nunito mb-2">
            <Text className="font-bold">Sono:</Text> Dormiu por {countSleep}
          </Text>
          <Text className="text-primary-darker font-nunito mb-2">
            <Text className="font-bold">Banho:</Text> Tomou banho {countShower}{" "}
            vez(es)
          </Text>
          <Text className="text-primary-darker font-nunito">
            <Text className="font-bold">Fraldas:</Text> Trocou a fralda{" "}
            {countDiaper} vez(es)
          </Text>
        </View>
      </View>

      <View className="">
        {isLoading && <LoadingBaby message="Buscando rotinas" />}

        {!isLoading && isError && (
          <Text className="text-center text-red-500 font-semibold mt-4">
            Erro ao carregar a API
          </Text>
        )}

        {!isLoading && !isError && routineData.length === 0 && (
          <EmptyState
            title="Está tudo tão calmo..."
            description="Parece que nenhuma rotina foi cadastrada nesse dia."
            buttonText="Registre uma rotina acima"
            isFullPage={true}
            show404Background={false}
            onButtonClick={() => {
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }}
          />
        )}

        {!isLoading && !isError && routineData.length > 0 && (
          <View className="relative w-full mt-4 pb-4">
            <View className="absolute left-[22px] top-4 bottom-4 w-1 bg-primary rounded-full z-0" />

            {routineData.map((item) => (
              <View key={`${item.log_type}${item.id}`} className="mb-4 z-10">
                <Card
                  routineData={item}
                  visibilityTrash={visibilityTrash}
                  onClick={onClickedCard}
                  onDelete={onDeleteCard}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default Routines;
