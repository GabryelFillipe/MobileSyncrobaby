import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { InsertDiary } from "../../diary/diary.service";
import { insertDiary } from "../../diary/diary.service";

export const useInsertDiary = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InsertDiary) => insertDiary(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["diary"] });
      router.back();
      return data;
    },

    onError: (error: Error) => {
      console.log("ERRO AO INSERIR DIÁRIO:", error.message);
    },
  });
};
