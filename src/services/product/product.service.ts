import { api } from "../api";

export interface ProductTypeId {
    id: number
    name: string
    unit: string
    id_type: number
    id_unity: number
    type: string
    quantity?: number
}

export interface ResponseProductsType {
    status_code: number
    product: ProductTypeId[]
}

export interface TypeProduct {
    id_product_type: number
    product_type_name: string
}

export interface ResponseTypeProduct {
    status_code: number
    type: TypeProduct[]
}

export const getProductsByType = async (id_product: number): Promise<ResponseProductsType> => {
  const response = await api.get<ResponseProductsType>(`/product/${id_product}`);
  return response.data;
};

export const getTypeProduct = async (): Promise<ResponseTypeProduct> => {
  const response = await api.get<ResponseTypeProduct>(`/type/product`);
  return response.data;
}