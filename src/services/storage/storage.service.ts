import { api } from "../api"

export interface ProductStorage {
    id: number
    id_product: number
    fk_id_product_type: number
    id_child: number
    product_name: string
    quantity: number
    type: string
    volume: number
    description: string | null
    measure: string
}

export interface InsertProduct {
    description: string | null
    quantity: number
    volume: number
    fk_id_child: number
    fk_id_product: number
}

export interface Products {
    id_product: number
    product_name: string
    fk_id_unit: number
    fk_id_product_type: number
}

export interface TypeProduct {
    id_product_type: number
    product_type_name: string
}

export interface ResponseGetStorage {
    status_code: number
    stock: ProductStorage[]
}

interface ResponseInsertStorage {
    status_code: number
}

interface ResponseStatusCodeStorage {
    status_code: number
}

export interface PatchQuantity {
    new_quantity: number
}

export const getProductsIdChild = async (childId: number): Promise<ResponseGetStorage> => {
    try {
        const response = await api.get<ResponseGetStorage>(`/stock/child/${childId}`);
        return response.data;

    } catch (error: any) {
        if (String(error).includes("404")) {
            return {
                status_code: 404,
                stock: []
            }
        }
        throw error
    }
};

export const getProductsByType = async (childId: number, type_id: number): Promise<ResponseGetStorage> => {
    try {
        const response = await api.get<ResponseGetStorage>(`/stock/type?child=${childId}&type=${type_id}`);
        return response.data;
    } catch (error: any) {
        if (String(error).includes("404")) {
            return {
                status_code: 200,
                stock: []
            }
        }
        throw error
    }

};

export const insertProduct = async (data: InsertProduct): Promise<ResponseInsertStorage> => {
    const response = await api.post<ResponseInsertStorage>("/stock", data);
    return response.data;
};

export const updateQuantityProduct = async (productId: number, data: PatchQuantity): Promise<ResponseStatusCodeStorage> => {
    const response = await api.patch<ResponseStatusCodeStorage>(`/stock/quantity/${productId}`, data);
    return response.data;
};

export const deleteProduct = async (productId: number): Promise<ResponseStatusCodeStorage> => {
    const response = await api.delete<ResponseStatusCodeStorage>(`/stock/${productId}`);
    return response.data;
};