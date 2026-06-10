import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { insertProduct } from "../../storage/storage.service"; 
import type { InsertProduct } from "../../storage/storage.service"; 
import { useNavigate } from "react-router-dom";

export const useInsertStorage = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (data: InsertProduct) => insertProduct(data),

        onSuccess: () => {
            alert("Produto adicionado com sucesso!")
            navigate(-1)
        },

        onError: (error: AxiosError) => {
            console.log("ERRO DA API:", error.response?.data);
            console.log("ERRO COMPLETO:", error);
            return error
        },
    });
}