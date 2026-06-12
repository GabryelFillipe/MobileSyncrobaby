import { useQuery } from "@tanstack/react-query";
import { getMeasuresHead } from "../../measures/measures.service";
import type { ResponseMeasuresHead } from "../../measures/measures.service";

export const useGetHeadMeasures = (child_id: number) => {
    return useQuery<ResponseMeasuresHead | string>({
        queryKey: ['headMeasures', child_id],
        queryFn: async () => {
        
                const response = await getMeasuresHead(child_id)

                return response
          
        }
    });
}