import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import type { RegisterSleep } from "../../routines/routines.service";
import { insertRegisterSleep } from "../../routines/routines.service";

export const useRegisterSleep = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterSleep) => insertRegisterSleep(data),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["feeding"] });
            Alert.alert("Registro feito!")
            router.back()
            return data
        },

        onError: (error: AxiosError) => {
            console.log("ERRO DA API:", error.response?.data);
            console.log("ERRO COMPLETO:", error);
        },
    });
}