import { useQuery } from "@tanstack/react-query";
import type { ResponseIllness } from "../../illness/illness.service";
import { getIllnessId } from "../../illness/illness.service";

export const useGetIllnessID = (id_illness: number) => {
  return useQuery<ResponseIllness | string>({
    queryKey: ["illness", id_illness],
    queryFn: async () => {
      try {
        const response = await getIllnessId(id_illness);
        return response;
      } catch {
        return "404: notFound";
      }
    },
  });
};
