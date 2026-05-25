import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { updateDiary } from "../../diary/diary.service";

export const useUpdateDiary = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      formData,
      idDiary,
    }: {
      formData: FormData;
      idDiary: number;
    }) => updateDiary(formData, idDiary),

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
