import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import EditIcon from "../../assets/icons/editIcon.svg";
import TrashIcon from "../../assets/icons/trash.svg";

export interface IProfessional {
  id_professional: number;
  professional_name: string;
  address: string;
  phone: string;
  specialty: string;
}

export interface ProfessionalCardProps {
  professional: IProfessional;
  onEdit: () => void;
  onDelete: () => Promise<void> | void;
}

export function ProfessionalCard({
  professional,
  onEdit,
  onDelete,
}: ProfessionalCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <View className="w-full bg-white shadow-purple-sm border-2 border-transparent rounded-xl flex flex-col p-5 mb-4 min-h-[140px] justify-center">
      {isConfirmingDelete ? (
        <View className="flex flex-col items-center justify-center gap-4 py-2">
          <Text className="text-gray-600 font-poppins text-center text-sm">
            Tem certeza que deseja remover{" "}
            <Text className="font-bold text-gray-800">
              {professional.professional_name}
            </Text>{" "}
            da sua rede de apoio?
          </Text>

          <View className="flex-row w-full justify-between gap-3 mt-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsConfirmingDelete(false)}
              disabled={isDeleting} // Trava o botão de cancelar durante o delete
              className="flex-1 bg-gray-100 py-3 rounded-lg items-center border border-gray-200"
            >
              <Text className="font-poppins font-bold text-gray-600 text-xs">
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleConfirmDelete}
              disabled={isDeleting} // Trava o botão de excluir
              className={`flex-1 py-3 rounded-lg items-center border ${
                isDeleting
                  ? "bg-red-50 border-red-100"
                  : "bg-red-100 border-red-200"
              }`}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <Text className="font-poppins font-bold text-red-600 text-xs">
                  Sim, excluir
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View className="w-full flex-row justify-between items-start mb-4">
            <View className="flex-row gap-3 items-center flex-1 pr-2">
              <View className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />

              <Text
                className="font-semibold font-poppins text-primary text-base leading-tight flex-1"
                numberOfLines={2}
              >
                {professional.professional_name}
              </Text>
            </View>
            <View className="flex flex-row gap-4">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsConfirmingDelete(true)}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                className="mt-1"
              >
                <TrashIcon width={16} height={16} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onEdit}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                className="mt-1"
              >
                <EditIcon width={16} height={16} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-col gap-3 flex-1">
            <View className="self-start px-3 py-1 bg-lilas rounded-full">
              <Text className="text-[#8B5CF6] text-xs font-bold font-poppins">
                {professional.specialty}
              </Text>
            </View>

            <Text
              className="font-nunito text-gray-500 text-sm flex-1"
              numberOfLines={2}
            >
              {professional.address}
            </Text>

            <Text className="font-nunito text-gray-600 text-sm font-semibold">
              {professional.phone}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
