import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { updateQuantityProduct } from "../../storage/storage.service";
import type { PatchQuantity } from "../../storage/storage.service";

export const usePatchStorage = () => {
    return useMutation({
        mutationFn: ({ data, id_product }: { data: PatchQuantity, id_product: number }) => updateQuantityProduct(id_product, data),

        onSuccess: () => {
            
        },

        onError: (error: AxiosError) => {
            console.log("ERRO DA API:", error.response?.data);
            console.log("ERRO COMPLETO:", error);
            return error
        },
    });
}