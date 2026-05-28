import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { type FilterOption } from "../DropdownFilter";

export interface DesktopFilterTabsProps {
  options: FilterOption[];
  selectedFilter: string;
  onSelect: (filter: string) => void;
}

export function DesktopFilterTabs({
  options,
  selectedFilter,
  onSelect,
}: DesktopFilterTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="hidden lg:flex w-full"
      contentContainerStyle={{ paddingBottom: 8, gap: 12 }}
    >
      {options.map((option) => {
        const isSelected = selectedFilter === option.label;

        return (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.7}
            onPress={() => onSelect(option.label)}
            className={`px-6 py-2 rounded-lg border items-center justify-center ${
              isSelected
                ? "bg-accent border-accent"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={`font-poppins font-semibold text-sm ${
                isSelected ? "text-white" : "text-gray-500"
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
