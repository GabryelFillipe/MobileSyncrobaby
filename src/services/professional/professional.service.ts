import { isAxiosError } from "axios";
import { api } from "../api";

export interface Professional {
  id_professional: number;
  professional_name: string;
  phone: string;
  last_consultation: string;
  address: string;
  fk_id_child: number;
  fk_id_specialization: number;
}

export interface InsertProfessional {
  professional_name: string;
  phone: string;
  last_consultation: string;
  address: string;
  fk_id_child: number;
  fk_id_specialization: number;
}

export interface ResponseProfessional {
  status_code: number;
  professional: Professional[];
}

export interface ResponseInsertProfessional {
  status_code: number;
  professional: Professional[];
}
export interface ResponseSingleProfessional {
  status_code: number;
  professional: InsertProfessional;
}

export interface ResponseDeleteProfessional {
  status_code: number;
  message: string;
}

export interface Specialty {
  id_specialization: number;
  specialization_name: string;
}

export interface ResponseSpecialty {
  status_code: number;
  specialty: Specialty[];
}

export const getProfessionals = async (
  childId: number,
): Promise<ResponseProfessional> => {
  try {
    const response = await api.get<ResponseProfessional>(
      `/professional/child/${childId}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { status_code: 200, professional: [] };
    }
    throw error;
  }
};

export const getProfessionalBySpecialization = async (
  specializationId: number,
  childId: number,
): Promise<ResponseProfessional> => {
  try {
    const response = await api.get<ResponseProfessional>(
      `/professional/specialty/?specialty=${specializationId}&child=${childId}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { status_code: 200, professional: [] };
    }
    throw error;
  }
};

export const insertProfessional = async (
  data: InsertProfessional,
): Promise<ResponseInsertProfessional> => {
  const response = await api.post<ResponseInsertProfessional>(
    `/professional`,
    data,
  );
  return response.data;
};

export const updateProfessional = async (
  data: InsertProfessional,
  idProfessional: number,
): Promise<ResponseSingleProfessional> => {
  const response = await api.put<ResponseSingleProfessional>(
    `/professional/${idProfessional}`,
    data,
  );
  return response.data;
};

export const deleteProfessional = async (
  idProfessional: number,
): Promise<ResponseDeleteProfessional> => {
  const response = await api.delete<ResponseDeleteProfessional>(
    `/professional/${idProfessional}`,
  );
  return response.data;
};

export const getSpecialties = async (): Promise<ResponseSpecialty> => {
  const response = await api.get<ResponseSpecialty>("/specialty");
  return response.data;
};
