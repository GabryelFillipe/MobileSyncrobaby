import React from "react";
import { View } from "react-native";
import Search from "../../assets/icons/search.svg";
import { InputDefault } from "../../components/InputDefault";

export interface MobileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MobileSearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
}: MobileSearchBarProps) {
  return (
    <View className="flex-row items-center w-full h-9 rounded-2xl bg-lilas shadow-purple-sm px-2 md:h-11 xl:hidden">
      <Search width={16} height={16} />

      <InputDefault
        className="flex-1 pl-2 font-poppins text-primary-text"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
      />
    </View>
  );
}
