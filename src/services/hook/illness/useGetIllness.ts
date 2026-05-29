import { useQuery } from "@tanstack/react-query";
import type { ResponseIllness } from "../../illness/illness.service";
import { getIllness } from "../../illness/illness.service";

export const useGetIllness = (child_id: number, canExecute: boolean) => {
  return useQuery<ResponseIllness>({
    queryKey: ["illness", child_id],
    queryFn: async () => {
      return await getIllness(child_id);
    },
    enabled: canExecute,
  });
};
