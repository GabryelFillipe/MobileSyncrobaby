import { useQuery } from "@tanstack/react-query";
import { getProductsIdChild } from "../../storage/storage.service"; 
import type { ResponseGetStorage } from "../../storage/storage.service";

export const useGetStorage = (child_id: number, canExecute: boolean) => {
   const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  return useQuery<ResponseGetStorage>({
    queryKey: ["storage", "child", child_id],
    queryFn: async () => {
      await delay(700)
      return getProductsIdChild(child_id)
    },
    enabled: canExecute
  });
};
