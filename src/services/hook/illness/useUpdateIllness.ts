import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import type { Illness } from "../../illness/illness.service";
import { updateIllness } from "../../illness/illness.service";

export const useUpdateIllness = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Illness) => updateIllness(data, data.id_illness),

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
