import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import type { InsertIllness } from "../../illness/illness.service";
import { insertIllness } from "../../illness/illness.service";

export const useInsertIllness = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InsertIllness) => insertIllness(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["illness"] });
      router.back();
      return data;
    },

    onError: (error: AxiosError) => {
      console.log("ERRO DA API:", error.response?.data);
      console.log("ERRO COMPLETO:", error);
    },
  });
};
