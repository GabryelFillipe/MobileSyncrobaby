import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactivateChild } from "../../children/children.service";

export const useReactivateChild = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, number>({
    mutationFn: (idChild: number) => reactivateChild(idChild),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      return data;
    },

    onError: (error: Error) => {
      console.log("ERRO AO REATIVAR FILHO:", error.message);
    },
  });
};
