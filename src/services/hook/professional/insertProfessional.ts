import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  insertProfessional,
  type InsertProfessional,
} from "../../professional/professional.service";

export const useInsertProfessional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InsertProfessional) => insertProfessional(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional"] });
    },
  });
};
