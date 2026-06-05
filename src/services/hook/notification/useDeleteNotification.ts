import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { deleteNotification } from "../../notification/notification.service";

export const useDeleteNotification = () => {
    return useMutation({
        mutationFn: (id_notification: number) => deleteNotification(id_notification),

        onSuccess: (response) => {
            return response
        },

        onError: (error: AxiosError) => {
            console.log("ERRO DA API:", error.response?.data);
            console.log("ERRO COMPLETO:", error);
        },
    });
}