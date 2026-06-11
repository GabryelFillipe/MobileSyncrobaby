import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import AddItemIcon from "../../assets/icons/addItemIcon.svg";
import RemoveItemIcon from "../../assets/icons/removeItemIcon.svg";

import type { ProductStorage } from "../../services/storage/storage.service.ts";

interface ProductCardProps {
  item: ProductStorage;
  getStatusColor: (quantity: number) => string;
  getStatusLabel: (quantity: number) => string;
  toggleCard: (id: number) => void;
  expandedCardId: number | null;
  updateItemQuantity: (id: number, delta: number) => void;
  handleDeleteItem: (id: number) => void;
  icon: React.ElementType;
}

export function ProductCard({
  item,
  getStatusColor,
  getStatusLabel,
  toggleCard,
  expandedCardId,
  updateItemQuantity,
  handleDeleteItem,
  icon: IconComponent,
}: ProductCardProps) {
  const { width } = useWindowDimensions();
  const visibleWidth = width - 48;

  return (
    <View
      key={item.id}
      className="flex-none w-full overflow-hidden rounded-sm shadow-purple-sm bg-white border-t-0"
      style={{
        borderTopColor: getStatusColor(item.quantity),
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={112}
        decelerationRate="fast"
        bounces={false}
        className="flex-row w-full bg-accent"
      >
        <View style={{ width: visibleWidth }} className="flex-row bg-white">
          <TouchableOpacity
            activeOpacity={1}
            className="z-10 flex-1 flex-col bg-white pb-4 border-black/30 border-r"
            style={{
              borderLeftWidth: 36,
              borderLeftColor: getStatusColor(item.quantity),
            }}
            onPress={() => toggleCard(item.id)}
          >
            <View className="flex-col justify-center py-4 pl-6 min-h-22">
              <Text className="font-bold font-poppins text-primary-text w-full text-md">
                {item.volume === 0
                  ? `${item.product_name} (un)`
                  : `${item.product_name} (${item.volume}${item.measure})`}
              </Text>
              <Text className="text-primary-dark text-md">
                Disponível: {item.quantity}
              </Text>
              <Text className="text-primary text-[10px] mt-2">{item.type}</Text>
            </View>

            {expandedCardId === item.id && (
              <View className="overflow-hidden">
                <View className="w-full px-6 pt-2">
                  {item.description ? (
                    <Text className="text-sm text-primary-dark font-poppins">
                      <Text className="font-bold">Descrição: </Text>
                      <Text className="italic">{item.description}</Text>
                    </Text>
                  ) : (
                    <Text className="text-sm font-poppins italic text-gray-400 opacity-90">
                      Nenhuma anotação extra por aqui
                    </Text>
                  )}
                </View>
              </View>
            )}
          </TouchableOpacity>

          <View className="w-28 flex-row items-center justify-center gap-2 bg-white">
            <TouchableOpacity
              onPress={() => updateItemQuantity(item.id, 1)}
              activeOpacity={0.8}
            >
              <AddItemIcon width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updateItemQuantity(item.id, -1)}
              activeOpacity={0.8}
            >
              <RemoveItemIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="items-center justify-center pl-4 w-28 active:opacity-80"
          style={{ backgroundColor: "var(--color-red-alert)" }}
          onPress={() => handleDeleteItem(item.id)}
        >
          <Text className="text-white font-poppins font-bold text-lg">
            Excluir
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
