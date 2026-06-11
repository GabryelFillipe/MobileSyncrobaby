import { useQuery } from "@tanstack/react-query";
import { getMeasuresWeight } from "../../measures/measures.service";
import type { ResponseMeasuresWeight } from "../../measures/measures.service";

export const useGetWeightMeasures = (child_id: number) => {
    return useQuery<ResponseMeasuresWeight | string>({
        queryKey: ['weightMeasures', child_id],
        queryFn: async () => {
        
                const response = await getMeasuresWeight(child_id)

                return response
          
        },
        enabled: false
    });
}