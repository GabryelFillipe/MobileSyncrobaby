import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import BtnPrimary from "../../src/components/BtnPrimary";
import { EmptyState } from "../../src/components/EmptyState";
import { IllnessCard } from "../../src/components/illness/IllnessCard";

export interface HealthRecord {
  id_illness: number;
  illness_name: string;
  illness_type: string;
  start_date: string;
  end_date: string;
  medication: string;
  description: string;
  fk_id_child: number;
}

const MOCK_ILLNESS: HealthRecord[] = [
  {
    id_illness: 1,
    illness_name: "Gripe Forte",
    illness_type: "acute",
    start_date: "2026-05-10T00:00:00Z",
    end_date: "2026-05-17T00:00:00Z",
    medication: "Paracetamol 500mg, 8/8h",
    description: "Febre alta nos 3 primeiros dias.",
    fk_id_child: 1,
  },
  {
    id_illness: 2,
    illness_name: "Asma",
    illness_type: "chronic",
    start_date: "2024-02-15T00:00:00Z",
    end_date: "",
    medication: "Aerolin em crise",
    description: "Piora no tempo seco e frio.",
    fk_id_child: 1,
  },
];

const filterOptions = [
  { id: "Todas", label: "Todas" },
  { id: "Aguda", label: "Aguda" },
  { id: "Crônica", label: "Crônica" },
];

export default function Health() {
  const router = useRouter();

  const [illnessList, setIllnessList] = useState<HealthRecord[]>(MOCK_ILLNESS);
  const [selectedFilter, setSelectedFilter] = useState("Todas");
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

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
      ? "Mas você vai ter que registrar?"
      : `Mas você vai ter que registrar alguma doença ${selectedFilter.toLowerCase()}?`;

  const toggleCard = (id: number) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const deleteItem = (id: number) => {
    setIllnessList((prev) => prev.filter((item) => item.id_illness !== id));
  };

  return (
    <View className="flex-1 w-full flex-col gap-6 bg-light px-4 pt-6">
      <View className="flex flex-row justify-between items-center w-full mb-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {filterOptions.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setSelectedFilter(opt.label)}
              className={`px-4 py-2 rounded-lg mr-2 border ${
                selectedFilter === opt.label
                  ? "bg-accent border-accent"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedFilter === opt.label ? "text-white" : "text-gray-500"
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="w-full mb-2">
        <BtnPrimary
          text="Registrar Enfermidade"
          className="bg-accent rounded-lg py-3 shadow-md w-full"
          textClassName="text-white font-bold text-center"
          onPress={() => router.push("/updateMeasure")} // /addIllness
        />
      </View>

      <ScrollView
        className="flex-1 w-full pb-10"
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length === 0 ? (
          <EmptyState
            title={emptyStateTitle}
            description={emptyStateDescription}
            buttonText="Adicionar enfermidade"
            onButtonClick={() => router.push("/")} // /addIllness
          />
        ) : (
          filteredItems.map((item) => (
            <IllnessCard
              key={item.id_illness}
              item={item}
              expandedCardId={expandedCardId}
              toggleCard={toggleCard}
              onDelete={deleteItem}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
