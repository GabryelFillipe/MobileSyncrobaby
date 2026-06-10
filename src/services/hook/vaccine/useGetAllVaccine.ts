import { useQuery } from "@tanstack/react-query";
import type { ResponseGetAllVaccine } from "../../vaccine/vaccine.service";
import { getAllVaccine } from "../../vaccine/vaccine.service";

export const useGetAllVaccine = (id_child: number) => {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
  return useQuery<ResponseGetAllVaccine>({
    queryKey: ["vaccine", "id_child", id_child],
    queryFn: async () => {
      delay(800)
      return await getAllVaccine(id_child);
    }
  });
};