import { useQuery } from "@tanstack/react-query";
import { getMeasuresHeight } from "../../measures/measures.service";
import type { ResponseMeasuresHeight } from "../../measures/measures.service";

export const useGetHeightMeasures = (child_id: number) => {
    return useQuery<ResponseMeasuresHeight | string>({
        queryKey: ['heightMeasures', child_id],
        queryFn: async () => {
            const response = await getMeasuresHeight(child_id)
            return response
        },
        enabled: false
    });
}