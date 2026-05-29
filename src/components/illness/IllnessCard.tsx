import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import EditIcon from "../../assets/icons/editIcon.svg";
import TrashIcon from "../../assets/icons/trash.svg";
import { Illness } from "../../services/illness/illness.service";
import DateUtils from "../../utils/Date";
import BtnPrimary from "../BtnPrimary";

interface IllnessCardProps {
  item: Illness;
  expandedCardId: number | null;
  toggleCard: (id: number) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export function IllnessCard({
  item,
  expandedCardId,
  toggleCard,
  onDelete,
  isDeleting = false,
}: IllnessCardProps) {
  const router = useRouter();
  const isExpanded = expandedCardId === item.id_illness;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const typeLabel = item.illness_type === "acute" ? "Aguda" : "Crônica";

  if (showDeleteConfirm) {
    return (
      <View className="w-full bg-white mb-4 p-6 border border-gray-200 rounded-xl shadow-sm">
        <Text className="font-nunito text-primary-text text-center text-base mb-6">
          Tem certeza que deseja remover{" "}
          <Text className="font-bold">{item.illness_name}</Text> do histórico?
        </Text>
        <View className="flex-row justify-between w-full gap-4">
          <BtnPrimary
            onPress={() => setShowDeleteConfirm(false)}
            text="Cancelar"
            className="flex-1 bg-[#F5F5F5] h-12 rounded-sm flex justify-center"
            textClassName="text-dark-purple font-bold text-sm"
          />
          <BtnPrimary
            onPress={() => onDelete(item.id_illness)}
            text={isDeleting ? "Excluindo..." : "Sim, excluir"}
            className="flex-1 bg-[#FFE5E5] h-12 rounded-sm flex justify-center"
            textClassName="text-[#EF4444] font-bold text-sm"
            disabled={isDeleting}
          />
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => toggleCard(item.id_illness)}
      className="relative w-full bg-lilas mb-4 p-4 border-2 border-primary-darker rounded-lg"
    >
      <TouchableOpacity
        className="absolute top-2 right-2 p-2 z-10"
        onPress={() => {
          router.push({
            pathname: "/(app)/illness/[id]",
            params: { id: item.id_illness },
          });
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

      {isExpanded && (
        <View className="flex flex-col gap-3 mt-4 pt-4 border-t border-primary">
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

            <TouchableOpacity
              onPress={() => setShowDeleteConfirm(true)}
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
