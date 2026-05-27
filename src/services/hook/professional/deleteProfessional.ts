import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProfessional } from "../../professional/professional.service";

export const useDeleteProfessional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idProfessional: number) => deleteProfessional(idProfessional),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional"] });
    },
  });
};
