import { useQuery } from "@tanstack/react-query";
import { getProfessionalBySpecialization } from "../../professional/professional.service";
import type { ResponseProfessional } from "../../professional/professional.service";

export const useGetProfessionalBySpecialty = (
  specializationId: number,
  childId: number,
  canExecute: boolean,
) => {
  return useQuery<ResponseProfessional>({
    queryKey: ["professional", "child", childId, "specialty", specializationId],
    queryFn: async () => {
      return await getProfessionalBySpecialization(specializationId, childId);
    },
    enabled: canExecute,
  });
};
