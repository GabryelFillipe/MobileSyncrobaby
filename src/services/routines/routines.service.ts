import { api } from "../api"

export interface Routines {
  child: number
  time: string
  date: string
  duration: string
  description: string | null
  title: string
  log_type: string
  id: number
  imageDesk?: string
  asClicked?: boolean
}

export interface ResponseRoutines {
  status_code: number
  routines: Routines[]
}

export interface RegisterSleep {
  start_time: string
  end_time: string
  description: string | null
  fk_id_child: number
}

export interface ProductId {
  id: number
  dosage?: number
  quantity_product?: number
}

export interface ProductIdBath {
  id: number
  quantity_product: number
}

export interface RegisterDiaper {
  date_time: string
  type: string
  description: string | null
  fk_id_child: number
  product_id: ProductId[]
}

export interface RegisterBath {
  start_time: string
  end_time: string
  description: string | null
  fk_id_child: number
  product_id: ProductIdBath[]
}

export interface RegisterMedication {
  date_time: string
  description: string | null
  fk_id_child: number
  product_id: ProductId[]
}

export interface RegisterFeeding {
  date_time: string
  description: string | null
  fk_id_child: number
  fk_id_product_type: number
  product_id: ProductId[]
}

export interface DeleteRoutine {
  status_code: number
  message: string
}

export const getRoutines = async (childId: number, date: string): Promise<ResponseRoutines> => {
  try {
    const response = await api.get<ResponseRoutines>(`/routines?child=${childId}&date=${date}`);
    return response.data;
  } catch (error: any) {
    if (String(error).includes("404")) {
      return {
        status_code: 200,
        routines: []
      }
    }
    throw error
  }
};

export const deleteRegisterRoutines = async (idRegister: number, type_delete: string): Promise<DeleteRoutine> => {
  const response = await api.delete<DeleteRoutine>(`/routines/${type_delete}/${idRegister}`);
  return response.data;
};

export const insertRegisterSleep = async (data: RegisterSleep): Promise<RegisterSleep> => {
  const response = await api.post<RegisterSleep>("/routines/sleep", data);
  return response.data;
};

export const insertRegisterDiaper = async (data: RegisterDiaper): Promise<RegisterDiaper> => {
  const response = await api.post<RegisterDiaper>("/routines/diaper", data);
  return response.data;
};

export const insertRegisterBath = async (data: RegisterBath): Promise<RegisterBath> => {
  const response = await api.post<RegisterBath>("/routines/bath", data);
  return response.data;
};

export const insertRegisterMedication = async (data: RegisterMedication): Promise<RegisterMedication> => {
  const response = await api.post<RegisterMedication>("/routines/medication", data);
  return response.data;
};

export const insertRegisterFeeding = async (data: RegisterFeeding): Promise<RegisterFeeding> => {
  const response = await api.post<RegisterFeeding>("/routines/feeding", data);
  return response.data;
};