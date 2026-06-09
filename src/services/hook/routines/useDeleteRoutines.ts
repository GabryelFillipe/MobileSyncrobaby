import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { deleteRegisterRoutines } from "../../routines/routines.service";

export const useDeleteRoutines = () => {
    return useMutation({
        mutationFn: ({ id_register, type }: { id_register: number, type: string }) => deleteRegisterRoutines(id_register, type),

        onSuccess: (data) => {
            return data
        },

        onError: (error: AxiosError) => {
            console.log("ERRO DA API:", error.response?.data);
            console.log("ERRO COMPLETO:", error);
        },
    });
}