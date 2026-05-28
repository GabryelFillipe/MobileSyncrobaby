import { useQuery } from "@tanstack/react-query";
import { getProductsByType, type ResponseProductsType } from "../../product/product.service";

export const useGetProductByType = (id_product_type: number) => {
  return useQuery<ResponseProductsType>({
    queryKey: ["product_type", id_product_type],
    queryFn: async () => {
      const response = await getProductsByType(id_product_type);
      return response;
    },
  });
};