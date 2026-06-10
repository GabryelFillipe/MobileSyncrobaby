import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import SolidFood from "../../src/assets/icons/appleBanana.svg";
import HygieneIcon from "../../src/assets/icons/hygieneIcon.svg";
import Acessory from "../../src/assets/icons/iconAcessory.svg";
import Remedy from "../../src/assets/icons/iconRemedy.svg";
import Search from "../../src/assets/icons/search.svg";
import BabyFood from "../../src/assets/routines/baby_food.svg";
import Milk from "../../src/assets/routines/milk.svg";

import { EmptyState } from "../../src/components/EmptyState";
import { LoadingBaby } from "../../src/components/Loading";
import { ProductCard } from "../../src/components/storage/ProductCard";

import { useDeleteStorage } from "../../src/services/hook/storage/useDeleteProduct";
import { useGetStorage } from "../../src/services/hook/storage/useGetStorage";
import { usePatchStorage } from "../../src/services/hook/storage/usePatchQuantityStorage";
import type {
  PatchQuantity,
  ProductStorage,
} from "../../src/services/storage/storage.service";

export interface InventoryItem {
  id: number;
  category: string;
  name: string;
  quantity: number;
  unitType: string;
  daysRemaining: number;
  description: string | null;
  themeColor: string;
}

const getCategoryIcon = (category: string): React.ElementType => {
  const icons: Record<string, React.ElementType> = {
    Acessórios: Acessory,
    "Alimentação (Papinha ou purê)": BabyFood,
    Higiene: HygieneIcon,
    "Alimentação (Alimento sólido)": SolidFood,
    "Alimentação (Leite e derivados)": Milk,
    Saúde: Remedy,
  };
  return icons[category] ?? HygieneIcon;
};

export default function Storage() {
  const router = useRouter();

  const [childId, setChildId] = useState<number>(0);
  const [inventoryItems, setInventoryItems] = useState<
    ProductStorage[] | undefined
  >([]);
  const [inventoryItemsFilter, setInventoryItemsFilter] = useState<
    ProductStorage[] | undefined
  >([]);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    async function loadChildId() {
      const storedId = await AsyncStorage.getItem("select_child");
      if (storedId) {
        setChildId(Number(storedId));
      }
    }
    loadChildId();
  }, []);

  const {
    data: onGetStorage,
    isError,
    isLoading,
    refetch,
  } = useGetStorage(childId, childId > 0);
  const { mutate: onPatchQuantity } = usePatchStorage();
  const { mutate: onDeleteStorage } = useDeleteStorage();

  const getStatusColor = (quantity: number) => {
    if (quantity <= 1) return "var(--color-red-light)";
    if (quantity <= 3) return "var(--color-yellow-warning)";
    return "var(--color-green-success)";
  };

  const getStatusLabel = (quantity: number): string => {
    if (quantity <= 1) return "Estoque baixo";
    if (quantity <= 3) return "Estoque em alerta";
    return "Estoque em dia";
  };

  function filteredItems(text: string) {
    const productFilter: ProductStorage[] | undefined =
      inventoryItemsFilter?.filter((it) =>
        it.product_name.toLowerCase().includes(text.toLowerCase()),
      );
    setInventoryItems(productFilter);
  }

  const updateItemQuantity = (id: number, delta: number) => {
    const product: ProductStorage[] | undefined = inventoryItems?.filter(
      (it) => it.id === id,
    );

    if (product && product.length > 0) {
      if (
        (product[0].quantity > 0 || delta === 1) &&
        product[0].quantity < 99
      ) {
        const newQuantity: PatchQuantity = {
          new_quantity: product[0].quantity + delta,
        };

        onPatchQuantity(
          {
            data: newQuantity,
            id_product: id,
          },
          {
            onSuccess: () => {
              const newData: ProductStorage[] | undefined = inventoryItems?.map(
                (it) => {
                  if (it.id === id) {
                    return { ...it, quantity: newQuantity.new_quantity };
                  }
                  return it;
                },
              );
              setInventoryItems(newData);
            },
            onError: () => {},
          },
        );
      }
    }
  };

  const toggleCard = (id: number) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const handleDeleteItem = (itemId: number) => {
    onDeleteStorage(itemId, {
      onSuccess: () => {
        refetch();
        const newProducts: ProductStorage[] = inventoryItems!.filter(
          (it) => it.id !== itemId,
        );
        setInventoryItems(newProducts);
      },
      onError: () => {},
    });
  };

  useEffect(() => {
    if (onGetStorage) {
      setInventoryItems(onGetStorage.stock);
      setInventoryItemsFilter(onGetStorage.stock);
    }
  }, [onGetStorage]);

  if (childId === 0) {
    return <LoadingBaby message="Carregando estoque..." />;
  }

  return (
    <View className="w-full h-full flex-col gap-6 bg-transparent px-6">
      <View className="flex-col gap-4">
        <View className="flex-row items-center w-full h-9 rounded-2xl bg-lilas shadow-purple-sm px-2">
          <Search width={16} height={16} />
          <TextInput
            className="flex-1 pl-2 bg-transparent outline-none border-none font-poppins items-center justify-center flex text-primary"
            value={userInput}
            onChangeText={(text) => {
              setUserInput(text);
              filteredItems(text);
            }}
            style={[{ paddingVertical: 0, textAlignVertical: "center" }]}
            placeholder="Buscar produto..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 p-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      >
        {isLoading && <LoadingBaby message="Buscando produtos" />}

        {!isLoading && isError && (
          <Text className="text-red-500 font-poppins text-center mt-4">
            Erro ao carregar a API
          </Text>
        )}

        {!isLoading && !isError && inventoryItems?.length === 0 && (
          <EmptyState
            isFullPage={true}
            show404Background={false}
            title="Nenhum produto encontrado!"
            description="O que acha de adicionar algo no estoque?"
            buttonText="Adicionar Produto"
            onButtonClick={() => router.push("/(app)/storage/addStorage")}
          />
        )}

        {!isLoading &&
          !isError &&
          inventoryItems?.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              icon={getCategoryIcon(item.type)}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              toggleCard={toggleCard}
              expandedCardId={expandedCardId}
              updateItemQuantity={updateItemQuantity}
              handleDeleteItem={handleDeleteItem}
            />
          ))}
      </ScrollView>

      {!isLoading &&
        !isError &&
        inventoryItems &&
        inventoryItems.length > 0 && (
          <View className="shrink-0 w-full flex-row justify-center pb-6">
            <TouchableOpacity
              onPress={() => router.push("/(app)/storage/addStorage")}
              activeOpacity={0.8}
              className="flex-row justify-center items-center bg-accent w-[90%] max-w-87 py-3 rounded-xl shadow-md"
            >
              <Text className="text-white font-poppins font-bold text-lg">
                Adicionar produto
              </Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  );
}
