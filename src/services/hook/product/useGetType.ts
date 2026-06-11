import { useQuery } from "@tanstack/react-query";
import { getTypeProduct } from "../../product/product.service";
import type { ResponseTypeProduct } from "../../product/product.service"; 

export const useGetTypeProduct = () => {
  return useQuery<ResponseTypeProduct>({
    queryKey: ["typeProduct"],
    queryFn: async () => {
      return await getTypeProduct();
    }
  });
};