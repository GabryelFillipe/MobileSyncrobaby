import { api } from "../api";

export interface AgeGroup {
  id_age_group: number,
  age_group_name: number,
  min_months: number,
  max_months: number
}

export interface ResponseAgeGroups {
  status_code: number;
  age_group: AgeGroup[];
}

export interface ResponseSingleAgeGroup {
  status_code: number;
  age_group: AgeGroup[];
}

export const getAllAgeGroups = async (): Promise<ResponseAgeGroups> => {
  try {
    const response = await api.get<ResponseAgeGroups>(
      `/age`,
    );
    return response.data;
  } catch (error: unknown) {
    if (String(error).includes("404")) {
      return { status_code: 404, age_group: [] };
    }
    throw error;
  }
};

export const getSingleAgeGroup = async (idAgeGroup: number): Promise<ResponseSingleAgeGroup> => {
  try {
    const response = await api.get<ResponseSingleAgeGroup>(
      `/age/${idAgeGroup}`
    );
    return response.data;
  } catch (error: unknown) {
    if (String(error).includes("404")) {
      return { status_code: 404, age_group: [] };
    }
    throw error;
  }
};