import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { deleteProduct } from "../../storage/storage.service";

export const useDeleteStorage = () => {
    return useMutation({
        mutationFn: (id_product: number) => deleteProduct(id_product),

        onSuccess: () => {
            
        },

        onError: (error: AxiosError) => {
            console.log("ERRO DA API:", error.response?.data);
            console.log("ERRO COMPLETO:", error);
            return error
        },
    });
}