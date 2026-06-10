import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import type { RegisterBath } from "../../routines/routines.service";
import { insertRegisterBath } from "../../routines/routines.service";

export const useRegisterBath = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterBath) => insertRegisterBath(data),

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