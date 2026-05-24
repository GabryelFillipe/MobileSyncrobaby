import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { Diary } from "../../diary/diary.service";
import { updateDiary } from "../../diary/diary.service";

export const useUpdateDiary = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Diary) => updateDiary(data, data.id_diary_note),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["diary"] });
      router.back();
      return data;
    },

    onError: (error: Error) => {
      console.log("ERRO AO ATUALIZAR DIÁRIO:", error.message);
    },
  });
};
