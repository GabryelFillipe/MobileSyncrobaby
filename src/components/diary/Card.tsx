import { useRouter, type Href } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import Edit from "../../assets/icons/editIcon.svg";
import SetPurple from "../../assets/icons/setPupleDirection.svg";

import DateUtils from "../../utils/Date";

export interface Register {
  id: number;
  title: string;
  creation_date: string;
  label_color?: string;
  midia?: string;
  text_content?: string;
}

interface Props {
  card: Register;
}

export default function Card({ card }: Props) {
  const router = useRouter();

  function handleEditPage(id: number) {
    router.push(`/(app)/anotationDiary/${id}?edit=true` as Href);
  }

  function handleViewPage(id: number) {
    router.push(`/(app)/anotationDiary/${id}` as Href);
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleViewPage(card.id)}
      className="w-full h-28 flex-row rounded-sm bg-white shadow-purple-sm mb-4"
    >
      <View
        style={{ backgroundColor: card.label_color || "#CCC" }}
        className="w-15 h-full rounded-l-sm"
      />

      <View className="flex-1 flex-col px-2 pt-2">
        <View className="w-full h-4 flex-row justify-end">
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleEditPage(card.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Edit width={12} height={12} />
          </TouchableOpacity>
        </View>

        <View className="flex-col w-full h-16 justify-center items-center mt-1">
          <Text
            className="font-poppins text-primary-text font-semibold text-[14px] text-center"
            numberOfLines={1}
          >
            {card.title}
          </Text>
          <Text className="font-nunito text-primary italic text-[14px]">
            {DateUtils.formatedDate(card.creation_date)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center flex-1 pb-1">
          <Text className="font-nunito text-primary italic text-[12px]">
            {DateUtils.subDaysFormated(card.creation_date)}
          </Text>

          <SetPurple width={16} height={16} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
