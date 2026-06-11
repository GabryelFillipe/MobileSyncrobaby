import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CheckIcon from "../assets/icons/checkIcon.svg";
import BtnPrimary from "./BtnPrimary";

export interface FilterOption {
  id: string;
  label: string;
}

interface DropdownFilterProps {
  options: FilterOption[];
  selectedFilter: string;
  onSelect: (filter: string) => void;
  functionExtra?: (option: string) => void
}

export function DropdownFilter({
  options,
  selectedFilter,
  onSelect,
  functionExtra
}: DropdownFilterProps) {
  const [activeFilter, setActiveFilter] = useState(false);

  return (
    <View className="relative z-50">
      <BtnPrimary
        text={selectedFilter}
        className="shadow-purple-md bg-white text-sm h-10 text-primary-text font-poppins font-semibold"
        onPress={() => setActiveFilter(!activeFilter)}
      />

      {activeFilter && (
        <View className="absolute top-11 left-0 bg-lilas border border-primary-text rounded-2xl flex flex-col p-4 gap-2 z-50 min-w-40">
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.7}
              className="flex-row gap-4 justify-between items-center"
              onPress={() => {
                onSelect(option.label);
                setActiveFilter(false);
                if (functionExtra) {
                  functionExtra(option.label)
                }
              }}
            >
              <Text className="font-poppins text-primary-text text-base">
                {option.label}
              </Text>

              {option.label === selectedFilter && (
                <CheckIcon width={14} height={14} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
