import { useMutation } from "@tanstack/react-query";
import {
  getChildDeactivate,
  type ResponseChild,
} from "../../children/children.service";

export const useGetChildDeactivate = () => {
  return useMutation<ResponseChild[], Error>({
    mutationFn: () => getChildDeactivate(),

    onSuccess: (data) => {
      return data;
    },

    onError: (error: Error) => {
      console.log("ERRO AO BUSCAR DESATIVADOS:", error.message);
    },
  });
};
