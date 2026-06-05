import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { patchNotificationRead } from "../../notification/notification.service";

export const usePatchNotificationRead = () => {
    return useMutation({
        mutationFn: (id_notification: number) => patchNotificationRead(id_notification),

        onSuccess: (response) => {
            return response
        },

        onError: (error: AxiosError) => {
            console.log("ERRO DA API:", error.response?.data);
            console.log("ERRO COMPLETO:", error);
        },
    });
}