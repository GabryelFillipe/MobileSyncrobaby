import { useQuery } from "@tanstack/react-query";
import { getAllAgeGroups } from "../../ageGroup/ageGroup.service";
import type { ResponseAgeGroups } from "../../ageGroup/ageGroup.service";

export const useGetAgeGroups = () => {
    return useQuery<ResponseAgeGroups>({
        queryKey: ['ageGroup'],
        queryFn: async () => {
           const response = await getAllAgeGroups()
           return response
       }
    });
}