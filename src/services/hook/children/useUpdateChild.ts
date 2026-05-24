import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateChild,
  type ResponseJSONUpdateChild,
  type UpdateChild,
} from "../../children/children.service";

export const useUpdateChild = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseJSONUpdateChild, Error, UpdateChild>({
    mutationFn: (data: UpdateChild) => updateChild(data, data.id_child),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({
        queryKey: ["child", data.response.id_child],
      });
      return data;
    },

    onError: (error: Error) => {
      console.log("ERRO AO ATUALIZAR FILHO:", error.message);
    },
  });
};
