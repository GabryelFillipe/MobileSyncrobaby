import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { HealthRecord } from "../../../app/(app)/health";
import EditIcon from "../../assets/icons/editIcon.svg";
import TrashIcon from "../../assets/icons/trash.svg";
import DateUtils from "../../utils/Date";
interface IllnessCardProps {
  item: HealthRecord;
  expandedCardId: number | null;
  toggleCard: (id: number) => void;
  onDelete: (id: number) => void;
}

export function IllnessCard({
  item,
  expandedCardId,
  toggleCard,
  onDelete,
}: IllnessCardProps) {
  const router = useRouter();
  const isExpanded = expandedCardId === item.id_illness;

  const typeLabel = item.illness_type === "acute" ? "Aguda" : "Crônica";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => toggleCard(item.id_illness)}
      className="relative w-full bg-lilas/80 mb-4 p-4 border-2 border-primary-darker rounded-lg"
    >
      <TouchableOpacity
        className="absolute top-2 right-2 p-2 z-10"
        onPress={(e) => {
          router.push(`/`); // /editIllness/${item.id_illness}
        }}
      >
        <EditIcon width={20} height={20} color="#8A56E2" />
      </TouchableOpacity>

      <View className="flex flex-col items-center justify-center w-full mb-2 pr-6">
        <Text className="font-bold font-poppins text-lg text-dark-purple text-center">
          {item.illness_name}
        </Text>
        <Text className="font-poppins text-md text-primary-text">
          Início em: {DateUtils.formatedDate(item.start_date)}
        </Text>
      </View>

      {/* Área Expansível */}
      {isExpanded && (
        <View className="flex flex-col gap-3 mt-4 pt-4 border-t border-primary/20">
          <View className="flex flex-row gap-1">
            <Text className="font-semibold text-dark-purple">Tipo:</Text>
            <Text className="text-primary-darker">{typeLabel}</Text>
          </View>

          <View className="flex flex-row gap-1">
            <Text className="font-semibold text-dark-purple">
              Data de início:
            </Text>
            <Text className="text-primary-darker">
              {DateUtils.formatedDate(item.start_date)}
            </Text>
          </View>

          {item.end_date ? (
            <View className="flex flex-row gap-1">
              <Text className="font-semibold text-dark-purple">
                Data de término:
              </Text>
              <Text className="text-primary-darker">
                {DateUtils.formatedDate(item.end_date)}
              </Text>
            </View>
          ) : null}

          <View className="flex flex-row justify-between items-start mt-2">
            <View className="flex flex-col gap-1 w-[80%]">
              <Text className="font-semibold text-dark-purple">Medicação:</Text>
              <Text className="text-primary-darker leading-tight">
                {item.medication}
              </Text>
            </View>

            {/* Botão de Excluir */}
            <TouchableOpacity
              onPress={() => onDelete(item.id_illness)}
              className="p-2"
            >
              <TrashIcon width={24} height={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
