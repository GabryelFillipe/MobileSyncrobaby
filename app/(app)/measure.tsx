import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import {
  DropdownFilter,
  type FilterOption,
} from "../../src/components/DropdownFilter";
import Chart from "../../src/components/measures/Chart";
import { RequireChildGuard } from "../../src/components/RequireChildGuard";

import { useChild } from "../../src/context/ChildContext";
import { useGetBmiMeasures } from "../../src/services/hook/measures/useGetBmiMeasures";
import { useGetHeadMeasures } from "../../src/services/hook/measures/useGetHeadMeasures";
import { useGetHeightMeasures } from "../../src/services/hook/measures/useGetHeightMeasures";
import { useGetWeightMeasures } from "../../src/services/hook/measures/useGetWeightMeasures";

import type {
  Bmi,
  Head,
  Height,
  Weight,
} from "../../src/services/measures/measures.service";

interface LabelDescription {
  label: string;
  description: string;
}

const filterOptions: FilterOption[] = [
  {
    id: "perimetro-cefalico",
    label: "Perímetro cefálico",
  },
  {
    id: "peso",
    label: "Peso",
  },
  {
    id: "altura",
    label: "Altura",
  },
  {
    id: "imc",
    label: "IMC",
  },
];

const descriptionMeasure: LabelDescription[] = [
  {
    label: "Perímetro cefálico",
    description:
      "Registre o perímetro cefálico para acompanhar o desenvolvimento, para isso use uma fita métrica para medir a circunferência da cabeça do seu bebê.",
  },
  {
    label: "Peso",
    description:
      "Registre o peso para acompanhar o desenvolvimento, para isso pese um adulto segurando o bebê e depois pese o adulto sozinho; a diferença entre os dois valores será o peso do bebê.",
  },
  {
    label: "Altura",
    description:
      "Registre a altura para acompanhar o desenvolvimento, para isso deite o bebê em uma superfície reta, estique suavemente as pernas e meça da cabeça aos pés com uma fita métrica.",
  },
  {
    label: "IMC",
    description:
      "Registre o IMC para acompanhar o desenvolvimento, para isso atualize as medidas periodicamente (mensalmente ou a cada 2 meses).",
  },
];

export default function Measures() {
  const router = useRouter();
  const { childId } = useChild();

  const {
    data: onGetHeighMeasures,
    refetch: refetcHeight,
    isFetched: fetchHeigh,
  } = useGetHeightMeasures(childId);
  const {
    data: onGetWeighMeasures,
    refetch: refetchWeight,
    isFetched: fetchWeigh,
  } = useGetWeightMeasures(childId);
  const { data: onGetHeadMeasures } = useGetHeadMeasures(childId);
  const {
    data: onGetBmiMeasures,
    refetch: refetchBMI,
    isFetched: fetchBmi,
  } = useGetBmiMeasures(childId);

  const [filterSelected, setFilterSelected] =
    useState<string>("Perímetro cefálico");
  const [dataChart, setDataChart] = useState<(Height | Weight | Bmi | Head)[]>(
    [],
  );
  const [lastRegister, setLastRegister] = useState<string>("Nenhum registro");
  const [beforeRegister, setBeforeRegister] =
    useState<string>("Nenhum registro");
  const [valueChart, setValueChart] = useState<string>("");

  function setDescriptionForMeasure() {
    if (filterSelected === "Perímetro cefálico") {
      return descriptionMeasure[0].description;
    } else if (filterSelected === "Peso") {
      return descriptionMeasure[1].description;
    } else if (filterSelected === "Altura") {
      return descriptionMeasure[2].description;
    } else if (filterSelected === "IMC") {
      return descriptionMeasure[3].description;
    }
  }

  function getLastRegister(data: (Height | Head | Weight | Bmi)[]) {
    interface Value {
      value: string | null;
    }

    if (data.length > 0) {
      const newArray: Value[] = data.map((it) => {
        let numberValue: number;

        if ("height" in it) {
          numberValue = Math.round(it.height! * 10) / 10;
          return { value: `${numberValue}cm` };
        } else if ("weight" in it) {
          numberValue = Math.round(it.weight! * 10) / 10;
          return { value: `${numberValue}kg` };
        } else if ("head_circumference" in it) {
          numberValue = Math.round(it.head_circumference! * 10) / 10;
          return { value: `${numberValue}cm` };
        } else if ("bmi" in it) {
          numberValue = Math.round(it.bmi! * 10) / 10;
          return { value: `${numberValue}` };
        }

        return { value: null };
      });

      setLastRegister(newArray[newArray.length - 1].value || "Nenhum registro");

      if (data.length > 1) {
        setBeforeRegister(
          newArray[newArray.length - 2].value || "Nenhum registro",
        );
      } else {
        setBeforeRegister("Nenhum registro");
      }
    } else {
      setLastRegister("Nenhum registro");
      setBeforeRegister("Nenhum registro");
    }
  }

  function changeDataChart(option: string) {
    if (option === "Peso") {
      setValueChart("weight");
      !fetchWeigh ? refetchWeight() : "";

      if (onGetWeighMeasures && typeof onGetWeighMeasures !== "string") {
        setDataChart(onGetWeighMeasures.weight);
        getLastRegister(onGetWeighMeasures.weight);
      }
    } else if (option === "Altura") {
      setValueChart("height");
      !fetchHeigh ? refetcHeight() : "";

      if (onGetHeighMeasures && typeof onGetHeighMeasures !== "string") {
        setDataChart(onGetHeighMeasures.height);
        getLastRegister(onGetHeighMeasures.height);
      }
    } else if (option === "IMC") {
      setValueChart("bmi");
      !fetchBmi ? refetchBMI() : "";

      if (onGetBmiMeasures && typeof onGetBmiMeasures !== "string") {
        setDataChart(onGetBmiMeasures.bmi);
        getLastRegister(onGetBmiMeasures.bmi);
      }
    } else if (option === "Perímetro cefálico") {
      setValueChart("head_circumference");

      if (onGetHeadMeasures && typeof onGetHeadMeasures !== "string") {
        setDataChart(onGetHeadMeasures.head_circumference);
        getLastRegister(onGetHeadMeasures.head_circumference);
      }
    }
  }

  useEffect(() => {
    if (!onGetHeighMeasures) return;
    if (typeof onGetHeighMeasures !== "string") {
      if (filterSelected === "Altura") {
        getLastRegister(onGetHeighMeasures.height);
        setValueChart("height");
        setDataChart(onGetHeighMeasures.height);
      }
    }
  }, [onGetHeighMeasures, filterSelected]);

  useEffect(() => {
    if (!onGetWeighMeasures) return;
    if (typeof onGetWeighMeasures !== "string") {
      if (filterSelected === "Peso") {
        getLastRegister(onGetWeighMeasures.weight);
        setValueChart("weight");
        setDataChart(onGetWeighMeasures.weight);
      }
    }
  }, [onGetWeighMeasures, filterSelected]);

  useEffect(() => {
    if (!onGetHeadMeasures) return;
    if (typeof onGetHeadMeasures !== "string") {
      if (filterSelected === "Perímetro cefálico") {
        getLastRegister(onGetHeadMeasures.head_circumference);
        setValueChart("head_circumference");
        setDataChart(onGetHeadMeasures.head_circumference);
      }
    }
  }, [onGetHeadMeasures, filterSelected]);

  useEffect(() => {
    if (!onGetBmiMeasures) return;
    if (typeof onGetBmiMeasures !== "string") {
      if (filterSelected === "IMC") {
        getLastRegister(onGetBmiMeasures.bmi);
        setValueChart("bmi");
        setDataChart(onGetBmiMeasures.bmi);
      }
    }
  }, [onGetBmiMeasures, filterSelected]);

  return (
    <RequireChildGuard>
      <ScrollView
        className="flex-1 bg-transparent px-4 py-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-col w-full gap-4">
          <View className="flex-row justify-between items-center w-full z-50">
            <View className="flex-1">
              <DropdownFilter
                options={filterOptions}
                selectedFilter={filterSelected}
                onSelect={(val) => {
                  setFilterSelected(val);
                  changeDataChart(val);
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push("/updateMeasure")}
              activeOpacity={0.8}
              className="flex-row justify-center items-center bg-accent h-10 rounded-sm px-4 ml-2"
            >
              <Text className="text-white font-poppins font-bold text-xs">
                Atualizar dados
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col px-3 py-4 border border-primary rounded-md mt-4 z-10">
            <Text className="font-nunito text-primary-text italic text-[14px]">
              {setDescriptionForMeasure()}
            </Text>

            <View className="flex-col font-poppins mt-4 gap-3">
              <View className="flex-row justify-between items-center bg-lilas-bg/70 rounded-md p-2 px-3">
                <Text className="font-semibold text-primary-text text-sm">
                  Hoje:
                </Text>
                <Text className="text-accent font-semibold text-sm">
                  {lastRegister}
                </Text>
              </View>

              <View className="flex-row justify-between items-center bg-lilas-bg/70 rounded-md p-2 px-3">
                <Text className="font-semibold text-primary-text text-sm">
                  Registro anterior:
                </Text>
                <Text className="text-accent font-semibold text-sm">
                  {beforeRegister}
                </Text>
              </View>
            </View>
          </View>

          <Text className="font-poppins text-primary-text font-bold text-xl mt-2">
            Gráfico de desenvolvimento
          </Text>

          <View className="w-full h-80 z-10">
            <Chart
              data={dataChart}
              value_type={
                valueChart as
                  | keyof Height
                  | keyof Head
                  | keyof Weight
                  | keyof Bmi
              }
            />
          </View>
        </View>
      </ScrollView>
    </RequireChildGuard>
  );
}
