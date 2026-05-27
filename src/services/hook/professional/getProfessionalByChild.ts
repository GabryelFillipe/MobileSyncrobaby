import { useQuery } from "@tanstack/react-query";
import { getProfessionals } from "../../professional/professional.service";
import type { ResponseProfessional } from "../../professional/professional.service";

export const useGetProfessionalsByChild = (
  childId: number,
  canExecute: boolean,
) => {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  return useQuery<ResponseProfessional>({
    queryKey: ["professional", "child", childId],
    queryFn: async () => {
      await delay(700);
      return await getProfessionals(childId);
    },
    enabled: canExecute,
  });
};
