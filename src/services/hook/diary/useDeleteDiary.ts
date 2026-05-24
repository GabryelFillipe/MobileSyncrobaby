import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { deleteDiary } from "../../diary/diary.service";

export const useDeleteDiary = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (diary_id: number) => deleteDiary(diary_id),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["diary"] });
      router.back();
      return data;
    },

    onError: (error: Error) => {
      console.log("ERRO AO DELETAR DIÁRIO:", error.message);
    },
  });
};
