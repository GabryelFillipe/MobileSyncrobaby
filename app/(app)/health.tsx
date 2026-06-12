import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import { LoadingBaby } from "@/src/components/Loading";
import BtnPrimary from "../../src/components/BtnPrimary";
import { DropdownFilter } from "../../src/components/DropdownFilter";
import { EmptyState } from "../../src/components/EmptyState";
import { IllnessCard } from "../../src/components/illness/IllnessCard";
import { RequireChildGuard } from "../../src/components/RequireChildGuard";

import { useChild } from "../../src/context/ChildContext";
import { useDeleteIllness } from "../../src/services/hook/illness/useDeleteIllness";
import { useGetIllness } from "../../src/services/hook/illness/useGetIllness";

const filterOptions = [
  { id: "Todas", label: "Todas" },
  { id: "Aguda", label: "Aguda" },
  { id: "Crônica", label: "Crônica" },
];

export default function Health() {
  const router = useRouter();
  const { childId } = useChild();

  const [selectedFilter, setSelectedFilter] = useState("Todas");
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const { data, isLoading } = useGetIllness(childId, childId !== 0);
  const deleteMutation = useDeleteIllness();

  const illnessList = data?.illness || [];

  const filteredItems = illnessList.filter((item) => {
    if (selectedFilter === "Todas") return true;
    const compareOpt = selectedFilter === "Aguda" ? "acute" : "chronic";
    return item.illness_type === compareOpt;
  });

  const emptyStateTitle =
    selectedFilter === "Todas"
      ? "Eba! Nenhuma doença registrada"
      : `Eba! Nenhuma doença ${selectedFilter.toLowerCase()} registrada`;

  const emptyStateDescription =
    selectedFilter === "Todas"
      ? "Parece que está tudo bem com seu bebê"
      : `Deseja registrar uma condição de saúde ${selectedFilter.toLowerCase()}?`;

  const toggleCard = (id: number) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const deleteItem = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <RequireChildGuard>
      {isLoading ? (
        <View className="flex-1 justify-center items-center bg-light">
          <LoadingBaby message="Carregando enfermidades..." />
        </View>
      ) : (
        <View className="flex-1 w-full flex-col bg-light px-4 pt-0">
          <View className="flex-row justify-between items-start w-full mb-6 z-50">
            <View className="w-[45%]">
              <DropdownFilter
                options={filterOptions}
                selectedFilter={selectedFilter}
                onSelect={setSelectedFilter}
              />
            </View>

            <BtnPrimary
              text="Registrar"
              className="w-[50%] bg-accent rounded-lg h-10 shadow-md"
              textClassName="text-white font-bold text-center text-sm"
              onPress={() => router.push("/(app)/illness/addIllness")}
            />
          </View>

          <View className="flex-1 z-10">
            <ScrollView
              className="flex-1 w-full "
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {filteredItems.length === 0 ? (
                <View className="flex-1 justify-center items-center mt-10">
                  <EmptyState
                    isFullPage={true}
                    show404Background={false}
                    title={emptyStateTitle}
                    description={emptyStateDescription}
                    buttonText="Adicionar enfermidade"
                    onButtonClick={() =>
                      router.push("/(app)/illness/addIllness")
                    }
                  />
                </View>
              ) : (
                filteredItems.map((item) => (
                  <IllnessCard
                    key={item.id_illness}
                    item={item}
                    expandedCardId={expandedCardId}
                    toggleCard={toggleCard}
                    onDelete={deleteItem}
                    isDeleting={deleteMutation.isPending}
                  />
                ))
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </RequireChildGuard>
  );
}
