import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import type { RegisterFeeding } from "../../routines/routines.service";
import { insertRegisterFeeding } from "../../routines/routines.service";

export const useRegisterFeeding = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterFeeding) => insertRegisterFeeding(data),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["feeding"] });
            router.back()
            return data
        },

        onError: (error: AxiosError) => {
            console.log("ERRO DA API:", error.response?.data);
            console.log("ERRO COMPLETO:", error);
        },
    });
}