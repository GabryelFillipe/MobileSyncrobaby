import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

import type { InsertProduct } from "../../storage/storage.service";
import { insertProduct } from "../../storage/storage.service";

export const useInsertStorage = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: InsertProduct) => insertProduct(data),

    onSuccess: () => {
      Alert.alert("Sucesso", "Produto adicionado com sucesso!");
      router.back();
    },

    onError: (error: AxiosError) => {
      console.log("ERRO DA API:", error.response?.data);
      console.log("ERRO COMPLETO:", error);
      Alert.alert(
        "Erro",
        "Não foi possível adicionar o produto. Tente novamente.",
      );
      return error;
    },
  });
};
