import { useQuery } from "@tanstack/react-query";
import type { ResponseChild } from "../../children/children.service";
import { getChildren } from "../../children/children.service"; // Ajuste o caminho do service se precisar

export const useGetChildren = () => {
  return useQuery<ResponseChild>({
    queryKey: ["children"],
    queryFn: async () => {
      const response = await getChildren();
      return response;
    },
  });
};
