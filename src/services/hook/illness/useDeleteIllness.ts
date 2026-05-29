import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { deleteIllness } from "../../illness/illness.service";

export const useDeleteIllness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (illness_id: number) => deleteIllness(illness_id),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["illness"] });
      return data;
    },

    onError: (error: AxiosError) => {
      console.log("ERRO DA API:", error.response?.data);
      console.log("ERRO COMPLETO:", error);
    },
  });
};
