import { useQuery } from "@tanstack/react-query";
import { getProductsByType } from "../../storage/storage.service";
import type { ResponseGetStorage } from "../../storage/storage.service"; 

export const useGetProductByTypeStorage = (type_id: number | null, id_child: number) => {
  return useQuery<ResponseGetStorage>({
    queryKey: ["product", "type_id", type_id, "child_id", id_child],
    queryFn: async () => {
      return await getProductsByType(id_child, type_id!);
    },
    enabled: !!type_id
  });
};