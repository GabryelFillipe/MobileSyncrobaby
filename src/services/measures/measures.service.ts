import { isAxiosError } from "axios";
import { api } from "../api";


export interface Measures {
  "height": number | null,
  "weight": number | null,
  "head_circumference": number | null,
  "description": string | null,
  "update_date": string, 
  "fk_id_child": number
}

export interface InsertMeasures {
  "height": number | null,
  "weight": number | null,
  "head_circumference": number | null,
  "description": string | null,
  "fk_id_child": number
}

export interface Height {
  "height": number | null,
  "update_date": string
}

export interface Weight {
  "weight": number | null,
  "update_date": string
}

export interface Head {
  "head_circumference": number | null,
  "update_date": string
}

export interface Bmi {
  "bmi": number | null,
  "update_date": string
}

export interface ResponseInsertMeasures {
  status_code: number;
  measures: Measures[];
}

export interface ResponseMeasuresHeight {
  status_code: number;
  height: Height[];
}

export interface ResponseMeasuresWeight {
  status_code: number;
  weight: Weight[];
}


export interface ResponseMeasuresHead {
  status_code: number;
  head_circumference: Head[];
}

export interface ResponseMeasuresBMI {
    status_code: number;
    bmi: Bmi[];
}

export const insertMeasures = async (
  data: InsertMeasures,
): Promise<ResponseInsertMeasures> => {
  const response = await api.post<ResponseInsertMeasures>(`/measures`, data);
  return response.data;
};


export const getMeasuresHeight = async (childId: number): Promise<ResponseMeasuresHeight> => {
  try {
    const response = await api.get<ResponseMeasuresHeight>(
      `/measures/height/${childId}`,
    );

    return response.data;
  } catch (error: any) {
    if (String(error).includes("404")) {
      return { status_code: 200, height: [] };
    }
    throw error;
  }
};

export const getMeasuresWeight = async (childId: number): Promise<ResponseMeasuresWeight> => {
  try {
    const response = await api.get<ResponseMeasuresWeight>(
      `/measures/weight/${childId}`,
    );
    return response.data;
  } catch (error: any) {
    if (String(error).includes("404")) {
      return { status_code: 404, weight: [] };
    }
    throw error;
  }
};

export const getMeasuresHead = async (childId: number): Promise<ResponseMeasuresHead> => {
  try {
    const response = await api.get<ResponseMeasuresHead>(
      `/measures/head/${childId}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (String(error).includes("404")) {
      return { status_code: 404, head_circumference: [] };
    }
    throw error;
  }
};

export const getMeasuresBmi = async (childId: number): Promise<ResponseMeasuresBMI> => {
  try {
    const response = await api.get<ResponseMeasuresBMI>(
      `/measures/bmi/${childId}`,
    );
    return response.data;
  } catch (error: unknown) {
     if (String(error).includes("404")) {
      return { status_code: 404, bmi: [] };
    }
    throw error;
  }
};