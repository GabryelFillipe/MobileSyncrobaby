import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import EditIcon from "../../src/assets/icons/editIcon.svg";
import { CarouselDots } from "../../src/components/CarouselDots";
import {
  DropdownFilter,
  type FilterOption,
} from "../../src/components/DropdownFilter";
import { LoadingBaby } from "../../src/components/Loading";
import { RequireChildGuard } from "../../src/components/RequireChildGuard";
import RoutineDate from "../../src/utils/Date";

import { useChild } from "../../src/context/ChildContext";
import { useGetAllVaccine } from "../../src/services/hook/vaccine/useGetAllVaccine";
import { useUpdateVaccineStatus } from "../../src/services/hook/vaccine/useUpdateVaccineStatus";
import type {
  JSONAgeGroup,
  UpdateVaccine,
} from "../../src/services/vaccine/vaccine.service";

interface Form {
  application_date: string;
}

const fallbackWidth = Dimensions.get("window").width - 32;

export default function Vaccines() {
  const { childId } = useChild();

  const {
    data: onGetAllVaccines,
    isLoading,
    isError,
    refetch,
  } = useGetAllVaccine(childId);
  const { mutate: onUpdateVaccine } = useUpdateVaccineStatus();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Form>();

  const [vaccines, setVaccines] = useState<JSONAgeGroup[]>([]);
  const [useVaccines, setUseVaccines] = useState<JSONAgeGroup[]>([]);
  const [ageGroup, setAgeGroup] = useState<string>("Todas");
  const [options, setOptions] = useState<FilterOption[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [vaccineSelectedId, setVaccineDataSelectedId] = useState<number | null>(
    null,
  );
  const [vaccineSelectedName, setVaccineDataSelectedName] =
    useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [carouselWidth, setCarouselWidth] = useState<number>(0);

  const flatListRef = useRef<FlatList>(null);

  const finalCardWidth = carouselWidth > 0 ? carouselWidth : fallbackWidth;

  function getAgeGroup(data: JSONAgeGroup[]) {
    let ageGroups: FilterOption[] = data.map((it) => ({
      id: it.age_group_name,
      label: it.age_group_name,
    }));
    ageGroups.unshift({ id: "Todas", label: "Todas" });
    setOptions(ageGroups);
  }

  function filterVaccine(option: string) {
    if (option === "Todas") {
      setUseVaccines(vaccines);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      setCurrentIndex(0);
      return;
    }
    setUseVaccines(vaccines.filter((it) => it.age_group_name === option));
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setCurrentIndex(0);
  }

  function updateVaccineDate(date: Form) {
    if (!vaccineSelectedId || !childId) return;

    const updateData: UpdateVaccine = {
      fk_id_child: childId,
      application_status: 1,
      application_date: date.application_date,
      fk_id_vaccine: vaccineSelectedId,
    };

    onUpdateVaccine(updateData, {
      onSuccess: () => {
        Alert.alert("Sucesso", "Vacina atualizada com sucesso!");
        setModalOpen(false);
        reset();
        refetch();
      },
      onError: () => {
        Alert.alert("Erro", "Não foi possível atualizar a vacina.");
      },
    });
  }

  useEffect(() => {
    if (onGetAllVaccines?.vaccine) {
      setVaccines(onGetAllVaccines.vaccine);
      setUseVaccines(onGetAllVaccines.vaccine);
      setAgeGroup("Todas");
      getAgeGroup(onGetAllVaccines.vaccine);
    }
  }, [onGetAllVaccines]);

  return (
    <RequireChildGuard>
      <View className="flex-1 w-full bg-white px-2">
        <Modal visible={modalOpen} transparent={true} animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50 px-4">
            <View className="w-full max-w-sm bg-lilas-bg p-6 rounded-xl items-center shadow-lg">
              <Text className="text-primary-text font-semibold text-center mb-4">
                Digite a data de aplicação da {vaccineSelectedName}
              </Text>

              <Controller
                control={control}
                rules={{ required: "Data obrigatória" }}
                name="application_date"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="AAAA-MM-DD"
                    onChangeText={onChange}
                    value={value}
                    className="pl-3 bg-white border border-gray-200 rounded-md w-full h-11 text-primary mb-2 text-center"
                  />
                )}
              />
              {errors.application_date?.message && (
                <Text className="text-red-600 text-sm font-nunito mb-2">
                  {errors.application_date.message}
                </Text>
              )}

              <Text className="text-[11px] italic text-primary-darker text-center mb-6">
                Obs: A data não poderá ser alterada após a confirmação
              </Text>

              <View className="flex-row justify-center gap-4 w-full">
                <TouchableOpacity
                  onPress={() => {
                    setModalOpen(false);
                    reset();
                  }}
                  className="bg-white border border-gray-300 rounded-md px-6 py-2.5"
                >
                  <Text className="text-gray-700 font-semibold">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit(updateVaccineDate)}
                  className="bg-accent rounded-md px-6 py-2.5"
                >
                  <Text className="text-white font-semibold">Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View className="w-full h-12 justify-center mb-2 z-50">
          <DropdownFilter
            options={options}
            onSelect={setAgeGroup}
            functionExtra={filterVaccine}
            selectedFilter={ageGroup || "Todas"}
          />
        </View>

        <View className="bg-primary rounded-xl flex-1 p-2 relative pb-4">
          {isLoading && !isError && (
            <LoadingBaby message="Procurando vacinas" />
          )}
          {isError && (
            <Text className="text-red-500 font-poppins text-center mt-4">
              Erro ao carregar dados do servidor
            </Text>
          )}

          {!isLoading && !isError && (
            <>
              <FlatList
                ref={flatListRef}
                data={useVaccines}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => String(item.id_age_group)}
                onLayout={(e) => setCarouselWidth(e.nativeEvent.layout.width)}
                onMomentumScrollEnd={(e) => {
                  if (finalCardWidth > 0) {
                    const index = Math.round(
                      e.nativeEvent.contentOffset.x / finalCardWidth,
                    );
                    setCurrentIndex(index);
                  }
                }}
                renderItem={({ item: age_group_vaccine }) => (
                  <View
                    style={{ width: finalCardWidth }}
                    className="px-1 h-full"
                  >
                    <View className="bg-lilas-medium p-4 rounded-xl flex-1">
                      <Text className="text-primary-text font-bold text-xl mb-4 text-center">
                        {age_group_vaccine.age_group_name}
                      </Text>

                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                      >
                        <View className="gap-4 pb-4">
                          {age_group_vaccine.vaccines.map((vaccine: any) => (
                            <View
                              key={vaccine.id_vaccine}
                              className="relative flex-col pb-4 font-nunito rounded-xl bg-white min-h-[160px] overflow-hidden"
                            >
                              <View className="px-3 py-2 w-full flex-row bg-primary justify-between">
                                <Text className="w-[50%] text-white font-semibold text-xs">
                                  Vacina
                                </Text>
                                <Text className="w-[25%] text-white font-semibold text-xs text-center">
                                  Status
                                </Text>
                                <Text className="w-[25%] text-white font-semibold text-xs text-right">
                                  Data
                                </Text>
                              </View>

                              <View className="p-3 gap-2 flex-1">
                                <View className="flex-row justify-between w-full">
                                  <Text
                                    className="w-[50%] text-primary-text font-bold text-sm"
                                    numberOfLines={1}
                                  >
                                    {vaccine.vaccine}
                                  </Text>
                                  <Text
                                    className={`w-[25%] text-center text-xs font-semibold ${
                                      vaccine.application_status === 0
                                        ? "text-red-500"
                                        : "text-primary-text"
                                    }`}
                                  >
                                    {vaccine.application_status === 0
                                      ? "Pendente"
                                      : "Aplicada"}
                                  </Text>
                                  <Text
                                    className={`w-[25%] text-right text-xs ${
                                      vaccine.application_status === 0
                                        ? "text-red-500"
                                        : "text-primary-text"
                                    }`}
                                  >
                                    {vaccine.application_date == null
                                      ? "Pendente"
                                      : RoutineDate.formatedDate(
                                          vaccine.application_date,
                                        )}
                                  </Text>
                                </View>

                                <Text className="text-xs text-primary mt-1">
                                  <Text className="text-primary-darker font-bold">
                                    Doenças evitadas:{" "}
                                  </Text>
                                  {vaccine.prevented_diseases}
                                </Text>

                                <Text className="text-xs text-primary italic mt-1">
                                  <Text className="text-primary-darker font-bold not-italic">
                                    Obs:{" "}
                                  </Text>
                                  {vaccine.observation
                                    ? vaccine.observation
                                    : "Sem observações"}
                                </Text>
                              </View>

                              {vaccine.application_status === 0 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalOpen(true);
                                    setVaccineDataSelectedId(
                                      vaccine.id_vaccine,
                                    );
                                    setVaccineDataSelectedName(vaccine.vaccine);
                                  }}
                                  className="absolute bottom-2 right-2 w-8 h-8 justify-center items-center bg-purple-100 rounded-md"
                                >
                                  <EditIcon />
                                </TouchableOpacity>
                              )}
                            </View>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                )}
              />

              {useVaccines.length > 1 && (
                <View className="flex flex-row justify-center w-full mt-3">
                  <CarouselDots
                    total={useVaccines.length}
                    activeIndex={currentIndex}
                  />
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </RequireChildGuard>
  );
}
