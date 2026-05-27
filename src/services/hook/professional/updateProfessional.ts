import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfessional,
  type InsertProfessional,
} from "../../professional/professional.service";

interface UpdatePayload {
  data: InsertProfessional;
  idProfessional: number;
}

export const useUpdateProfessional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, idProfessional }: UpdatePayload) =>
      updateProfessional(data, idProfessional),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional"] });
    },
  });
};
