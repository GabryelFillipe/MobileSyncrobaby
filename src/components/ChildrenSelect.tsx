import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

import PlusIcon from "../../src/assets/icons/plus.svg";

interface Children {
  id: number;
  name: string;
  age: number;
}

interface Props {
  idChild: number;
  setChild: (id: number) => void;
}

export default function ChildrenSelect({ idChild, setChild }: Props) {
  const router = useRouter();

  const children: Children[] = [
    { id: 1, name: "Pedro", age: 6 },
    { id: 2, name: "Luana", age: 7 },
    { id: 3, name: "Gabryel", age: 7 },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row py-2 px-4 w-full"
      contentContainerStyle={{ alignItems: "center", gap: 12 }}
    >
      {children.map((child) => (
        <TouchableOpacity
          key={child.id}
          onPress={() => setChild(child.id)}
          activeOpacity={0.7}
          className={`px-5 py-2.5 rounded-2xl border ${
            idChild === child.id
              ? "bg-accent border-accent shadow-sm"
              : "bg-white border-gray-200"
          }`}
        >
          <Text
            className={`font-semibold font-poppins ${
              idChild === child.id ? "text-white" : "text-gray-700"
            }`}
          >
            {child.name}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => router.push("/")} // addChild
        className="p-3 bg-white border border-gray-200 rounded-full ml-2 flex items-center justify-center shadow-sm"
      >
        <PlusIcon width={16} height={16} color="#8A56E2" />
      </TouchableOpacity>
    </ScrollView>
  );
}
