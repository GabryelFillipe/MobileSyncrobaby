import { isAxiosError } from "axios";
import { api } from "../api";

export interface Illness {
  id_illness: number;
  illness_name: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  illness_type: string;
  medication: string | null;
  fk_id_child: number;
}

export interface InsertIllness {
  illness_name: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  illness_type: string;
  medication: string | null;
  fk_id_child: number;
}

export interface ResponseIllness {
  status_code: number;
  illness: Illness[];
}

export interface ResponseInsertIllness {
  status_code: number;
  illness: Illness[];
}

export interface ResponseSingleIllness {
  status_code: number;
  illness: InsertIllness;
}

export interface ResponseDeleteIllness {
  status_code: number;
  message: string;
}

export const getIllness = async (childId: number): Promise<ResponseIllness> => {
  try {
    const response = await api.get<ResponseIllness>(
      `/illness/child/${childId}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { status_code: 200, illness: [] };
    }
    throw error;
  }
};

export const getIllnessId = async (
  idIllness: number,
): Promise<ResponseIllness> => {
  try {
    const response = await api.get<ResponseIllness>(`/illness/${idIllness}`);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { status_code: 200, illness: [] };
    }
    throw error;
  }
};

export const getIllnessType = async (
  type: number,
): Promise<ResponseIllness> => {
  try {
    const response = await api.get<ResponseIllness>(`/illness/type/${type}`);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { status_code: 200, illness: [] };
    }
    throw error;
  }
};

export const insertIllness = async (
  data: InsertIllness,
): Promise<ResponseInsertIllness> => {
  const response = await api.post<ResponseInsertIllness>(`/illness`, data);
  return response.data;
};

export const updateIllness = async (
  data: InsertIllness,
  idIllness: number,
): Promise<ResponseSingleIllness> => {
  const response = await api.put<ResponseSingleIllness>(
    `/illness/${idIllness}`,
    data,
  );
  return response.data;
};

export const deleteIllness = async (
  idIllness: number,
): Promise<ResponseDeleteIllness> => {
  const response = await api.delete<ResponseDeleteIllness>(
    `/illness/${idIllness}`,
  );
  return response.data;
};
