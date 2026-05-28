import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import BtnPrimary from "../../src/components/BtnPrimary";
import {
  DropdownFilter,
  type FilterOption,
} from "../../src/components/DropdownFilter";
import { EmptyState } from "../../src/components/EmptyState";
import { LoadingBaby } from "../../src/components/Loading";
import { DesktopFilterTabs } from "../../src/components/professional/DesktopFilterTabs";
import { MobileSearchBar } from "../../src/components/professional/MobileSearchBar";
import { ProfessionalCard } from "../../src/components/professional/ProfessionalCard";
import { SupportNetworkCard } from "../../src/components/professional/SupportNetworkCard";

import { useDeleteProfessional } from "../../src/services/hook/professional/deleteProfessional";
import { useGetProfessionalsByChild } from "../../src/services/hook/professional/getProfessionalByChild";
import { useGetProfessionalBySpecialty } from "../../src/services/hook/professional/getProfessionalBySpecialty";
import { useGetSpecialties } from "../../src/services/hook/specialty/getSpecialty";

export default function Professional() {
  const router = useRouter();

  const [childId, setChildId] = useState<number>(0);

  const [userInput, setUserInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("Todas");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number>(0);

  useEffect(() => {
    async function loadChildId() {
      const storedId = await AsyncStorage.getItem("select_child");
      if (storedId) {
        setChildId(Number(storedId));
      }
    }
    loadChildId();
  }, []);

  const { data: specialtiesResponse } = useGetSpecialties();
  const { mutateAsync: deleteProfessional } = useDeleteProfessional();

  const isFetchingAll = selectedSpecialtyId === 0;

  const {
    data: dataAll,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useGetProfessionalsByChild(childId, isFetchingAll && childId > 0);

  const {
    data: dataSpecialty,
    isLoading: isLoadingSpecialty,
    isError: isErrorSpecialty,
  } = useGetProfessionalBySpecialty(
    selectedSpecialtyId,
    childId,
    !isFetchingAll && childId > 0,
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(userInput);
    }, 600);

    return () => clearTimeout(handler);
  }, [userInput]);

  const isSearching = userInput !== debouncedInput;

  const data = isFetchingAll ? dataAll : dataSpecialty;
  const isLoading = isFetchingAll ? isLoadingAll : isLoadingSpecialty;
  const isError = isFetchingAll ? isErrorAll : isErrorSpecialty;

  const specialtiesList = specialtiesResponse?.specialty || [];
  const professionalsList = data?.professional || [];

  const filterOptions: FilterOption[] = [
    { id: "0", label: "Todas" },
    ...specialtiesList.map((spec) => ({
      id: String(spec.id_specialization),
      label: spec.specialization_name,
    })),
  ];

  const handleFilterSelect = (incomingValue: string) => {
    setSelectedFilter(incomingValue);

    if (incomingValue === "Todas" || incomingValue === "0") {
      setSelectedSpecialtyId(0);
      return;
    }

    const foundSpecialty = specialtiesList.find(
      (spec) =>
        spec.specialization_name === incomingValue ||
        String(spec.id_specialization) === incomingValue,
    );

    if (foundSpecialty) {
      setSelectedSpecialtyId(foundSpecialty.id_specialization);
    }
  };

  const filteredItems = professionalsList.filter((item) =>
    item.professional_name
      .trim()
      .toLowerCase()
      .includes(debouncedInput.toLowerCase()),
  );

  const emptyStateTitle =
    selectedSpecialtyId === 0
      ? "Ops! Nenhum especialista encontrado."
      : `Ops! Nenhum profissional de ${selectedFilter.toLowerCase()} encontrado.`;

  const emptyStateDescription =
    selectedSpecialtyId === 0
      ? "Sua rede de apoio ainda não tem profissionais cadastrados. Que tal adicionar o primeiro?"
      : "Parece que essa especialidade foi parar na caixa de brinquedos. Que tal adicionar um novo profissional?";

  // if (!isLoading && !isSearching && !isError && filteredItems.length === 0) {
  //   return (
  //     <EmptyState
  //       isFullPage={true}
  //       show404Background={false}
  //       title={emptyStateTitle}
  //       description={emptyStateDescription}
  //       buttonText="Adicionar profissional"
  //       onButtonClick={() => router.push("/addProfessional")}
  //     />
  //   );
  // }

  if (childId === 0) {
    return <LoadingBaby message="Carregando profissionais..." />;
  }

  return (
    <ScrollView
      className="flex-1 bg-transparent px-4 py-2"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-col gap-6 pb-20">
        <MobileSearchBar
          value={userInput}
          onChange={setUserInput}
          placeholder="Buscar profissional..."
        />

        <SupportNetworkCard />

        <View className="w-full flex-row justify-between items-center z-50 gap-4">
          <View className="flex-1 flex-row justify-between items-center lg:hidden">
            <DropdownFilter
              options={filterOptions}
              selectedFilter={selectedFilter}
              onSelect={handleFilterSelect}
            />
            <BtnPrimary
              text="Adicionar profissional"
              className="bg-accent flex justify-center items-center h-10 shadow-md ml-2 px-3"
              textClassName="text-white font-poppins font-bold text-xs text-center"
              onPress={() => router.push("/addProfessional")}
            />
          </View>

          <View className="hidden lg:flex">
            <DesktopFilterTabs
              options={filterOptions}
              selectedFilter={selectedFilter}
              onSelect={handleFilterSelect}
            />
          </View>
        </View>

        <View className="w-full flex-col gap-4 mt-0 z-10">
          {(isLoading || isSearching) && (
            <View className="py-10">
              <LoadingBaby message="Buscando profissionais" />
            </View>
          )}

          {!isLoading && !isSearching && isError && (
            <Text className="text-red-500 font-poppins text-center mt-4">
              Erro ao buscar a rede de apoio. Tente novamente mais tarde.
            </Text>
          )}

          {!isLoading &&
            !isSearching &&
            !isError &&
            filteredItems.length === 0 && (
              <View className="flex-col items-center justify-center">
                <EmptyState
                  isFullPage={true}
                  show404Background={false}
                  title={emptyStateTitle}
                  description={emptyStateDescription}
                  buttonText="Adicionar profissional"
                  onButtonClick={() => router.push("/addProfessional")}
                />
              </View>
            )}

          {!isLoading &&
            !isSearching &&
            !isError &&
            filteredItems.map((professional) => {
              const specialtyName =
                specialtiesList.find(
                  (s) =>
                    s.id_specialization === professional.fk_id_specialization,
                )?.specialization_name || "Outro";

              return (
                <ProfessionalCard
                  key={professional.id_professional}
                  professional={{ ...professional, specialty: specialtyName }}
                  onEdit={() =>
                    router.push({
                      pathname: "/professional/[id]",
                      params: {
                        id: professional.id_professional,
                        data: JSON.stringify(professional),
                      },
                    })
                  }
                  onDelete={async () => {
                    try {
                      await deleteProfessional(professional.id_professional);
                    } catch (error) {
                      console.error("Erro ao deletar:", error);
                    }
                  }}
                />
              );
            })}
        </View>
      </View>
    </ScrollView>
  );
}
