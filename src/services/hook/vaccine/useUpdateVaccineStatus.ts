import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { UpdateVaccine } from "../../vaccine/vaccine.service";
import { updateVaccineStatus } from "../../vaccine/vaccine.service";

export const useUpdateVaccineStatus = () => {
    return useMutation({
        mutationFn: (data: UpdateVaccine) => updateVaccineStatus(data),

        onSuccess: (response) => {
            return response
        },

        onError: (error: AxiosError) => {
            console.log("ERRO DA API:", error.response?.data);
            console.log("ERRO COMPLETO:", error);
        },
    });
}