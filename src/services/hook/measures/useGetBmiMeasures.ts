import { useQuery } from "@tanstack/react-query";
import { getMeasuresBmi } from "../../measures/measures.service";
import type { ResponseMeasuresBMI } from "../../measures/measures.service";

export const useGetBmiMeasures = (child_id: number) => {
    return useQuery<ResponseMeasuresBMI | string>({
        queryKey: ['bmiMeasures', child_id],
        queryFn: async () => {
        
                const response = await getMeasuresBmi(child_id)

                return response
          
        },
        enabled: false
    });
}