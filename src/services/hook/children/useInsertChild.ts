import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  insertChild,
  type InsertChild,
  type ResponseInsertChild,
} from "../../children/children.service";

export const useInsertChild = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseInsertChild, Error, InsertChild>({
    mutationFn: (data: InsertChild) => insertChild(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      router.back();
      return data;
    },

    onError: (error: Error) => {
      console.log("ERRO AO INSERIR FILHO:", error.message);
    },
  });
};
