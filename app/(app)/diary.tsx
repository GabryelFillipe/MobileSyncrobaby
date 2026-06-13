import { useRouter, type Href } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { LoadingBaby } from "@/src/components/Loading";
import Search from "../../src/assets/icons/search.svg";
import Card from "../../src/components/diary/Card";
import { EmptyState } from "../../src/components/EmptyState";
import { InputDefault } from "../../src/components/InputDefault";
import { RequireChildGuard } from "../../src/components/RequireChildGuard";

import { useChild } from "../../src/context/ChildContext";
import { useGetDiary } from "../../src/services/hook/diary/useGetDiary";

export default function Diary() {
  const router = useRouter();
  const { childId } = useChild();

  const { data, isLoading, isError, error, refetch } = useGetDiary(childId);
  const [searchText, setSearchText] = useState("");

  const diaryList = data?.diary || [];

  const filteredDiary = diaryList.filter((it) =>
    it?.title?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <RequireChildGuard>
      {isLoading ? (
        <View className="flex-1 justify-center items-center bg-light">
          <LoadingBaby message="Carregando registros..." />
        </View>
      ) : isError ? (
        <EmptyState
          isFullPage={true}
          show404Background={true}
          title="Ops! Algo deu errado."
          description={error?.message || "Não conseguimos carregar o diário."}
          buttonText="Tentar Novamente"
          onButtonClick={() => refetch()}
        />
      ) : diaryList.length === 0 ? (
        <EmptyState
          isFullPage={true}
          title="Diário Vazio"
          description="Você ainda não tem nenhuma lembrança registrada."
          buttonText="Criar primeira lembrança"
          onButtonClick={() =>
            router.push("/(app)/anotationDiary/newAnotation" as Href)
          }
        />
      ) : (
        <View className="flex-1 items-center w-full bg-light px-4">
          <View className="flex-row items-center w-full h-12 rounded-2xl bg-lilas shadow-purple-sm px-4 mt-6">
            <Search width={16} height={16} />
            <InputDefault
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Buscar..."
              className="flex-1 ml-3 font-poppins text-primary-text h-full"
            />
          </View>

          <ScrollView
            className="w-full flex-1 mt-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {filteredDiary.map((it) => (
              <Card
                key={it.id_diary_note}
                card={{
                  id: it.id_diary_note,
                  title: it?.title || "Sem título",
                  creation_date: it?.date || "",
                  label_color: it?.color || "#9D87D2",
                  text_content: it?.content || "",
                  midia: it?.media || "",
                }}
              />
            ))}
          </ScrollView>

          <View className="absolute bottom-6 w-full items-center">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push("/(app)/anotationDiary/newAnotation" as Href)
              }
              className="flex-row justify-center items-center w-[90%] h-14 bg-accent rounded-sm"
            >
              <Text className="text-white font-poppins font-semibold text-lg">
                Adicionar novo registro
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </RequireChildGuard>
  );
}
