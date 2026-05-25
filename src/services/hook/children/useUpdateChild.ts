import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateChild,
  type ResponseJSONUpdateChild,
} from "../../children/children.service";

export const useUpdateChild = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseJSONUpdateChild,
    Error,
    { formData: FormData; childId: number }
  >({
    mutationFn: ({ formData, childId }) => updateChild(formData, childId),

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
