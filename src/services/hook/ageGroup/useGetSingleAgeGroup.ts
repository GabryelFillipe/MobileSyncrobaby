import { useQuery } from "@tanstack/react-query";
import { getSingleAgeGroup } from "../../ageGroup/ageGroup.service";
import type { ResponseSingleAgeGroup } from "../../ageGroup/ageGroup.service";

export const useGetSingleAgeGroup = (id_age_group: number) => {
    return useQuery<ResponseSingleAgeGroup | string>({
        queryKey: ['singleAgeGroup', id_age_group],
        queryFn: async () => {
                
           const response = await getSingleAgeGroup(id_age_group)
        
           return response
              
       }
    });
}
