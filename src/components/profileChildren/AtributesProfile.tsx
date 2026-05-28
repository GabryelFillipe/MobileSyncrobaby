import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

import { type ListDescription } from "../../../app/(app)/child/[id]";
import RedirectSet from "../../assets/profileChildren/redirectSet.svg";
import { InputDefault } from "../../components/InputDefault";

interface Props {
  listDescription: ListDescription;
  onlyRead: boolean;

  dateValue?: string;
  onDateChange?: (date: string) => void;
  bloodValue?: string;
  onBloodChange?: (blood: string) => void;
}

function AtributesProfile({
  listDescription,
  onlyRead,
  dateValue,
  onDateChange,
  bloodValue,
  onBloodChange,
}: Props) {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getDisplayDate = (dateString?: string) => {
    if (!dateString) return "DD/MM/AAAA";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate && onDateChange) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      onDateChange(formattedDate);
    }
  };

  const IconComponent = listDescription.img;

  return (
    <View className="flex-row justify-between items-center w-full h-14 px-4 rounded-xl bg-white shadow-purple-sm mb-2">
      <View className="flex-row items-center flex-1 pr-4">
        <IconComponent width={20} height={20} />

        <Text className="font-nunito ml-2 text-primary-text font-semibold text-sm">
          {listDescription.title}
        </Text>

        <View className="flex-1 ml-2">
          {listDescription.title === "Data de nascimento:" ? (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={onlyRead}
                onPress={() => setShowDatePicker(true)}
                className={`w-32 h-8 justify-center pl-2 ${
                  !onlyRead ? "border-2 border-primary rounded-lg" : ""
                }`}
              >
                <Text
                  className={`font-poppins text-sm ${
                    dateValue ? "text-primary-text" : "text-gray-400"
                  }`}
                >
                  {getDisplayDate(dateValue)}
                </Text>
              </TouchableOpacity>

              {showDatePicker && !onlyRead && (
                <DateTimePicker
                  value={dateValue ? new Date(dateValue) : new Date()}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
            </>
          ) : listDescription.title === "Tipo sanguíneo:" ? (
            <InputDefault
              type="text"
              placeholder="Ex: O+"
              editable={!onlyRead}
              value={bloodValue || ""}
              onChangeText={onBloodChange}
              onBlur={() => {}}
              className={`w-20 h-8 pl-2 py-0 text-sm font-poppins text-primary-text ${
                !onlyRead ? "border-2 border-primary rounded-lg" : ""
              }`}
            />
          ) : (
            <Text className="text-sm font-poppins text-primary-text">
              {listDescription.value}
            </Text>
          )}
        </View>
      </View>

      {listDescription.title !== "Data de nascimento:" &&
        listDescription.title !== "Tipo sanguíneo:" && (
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => {
              if (listDescription.path) {
                router.push(listDescription.path as any);
              }
            }}
          >
            <RedirectSet width={16} height={16} />
          </TouchableOpacity>
        )}
    </View>
  );
}

export default AtributesProfile;
