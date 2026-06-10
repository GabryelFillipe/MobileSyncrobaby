import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import type { RegisterMedication } from "../../routines/routines.service";
import { insertRegisterMedication } from "../../routines/routines.service";

export const useRegisterMedication = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterMedication) => insertRegisterMedication(data),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["medication"] });
            router.back()
            return data
        },

        onError: (error: AxiosError) => {
            console.log("ERRO DA API:", error.response?.data);
            console.log("ERRO COMPLETO:", error);
        },
    });
}