import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import type { InsertMeasures } from "../../measures/measures.service";
import { insertMeasures } from "../../measures/measures.service";

export const useInsertMeasures = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: InsertMeasures) => insertMeasures(data),

    onSuccess: (data) => {
      router.back();
      return data;
    },

    onError: (error: AxiosError) => {
      console.log("ERRO DA API:", error.response?.data);
      console.log("ERRO COMPLETO:", error);
    },
  });
};
