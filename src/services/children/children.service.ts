import { AxiosError } from "axios";
import { api } from "../api";

export interface Children {
  id_child: number;
  child_name: string;
  height: number;
  weight: number;
  birth_date: string;
  BMI: null | number;
  blood_type: string;
  gender: string;
  photo: string;
  active: number;
  fk_id_guardian: number;
}

export interface ResponseChild {
  status_code: number;
  children: Children[];
}

export interface ResponseChildId {
  status_code: number;
  child: Children[];
}

export interface UpdateChild {
  id_child: number;
  child_name: string;
  birth_date: string;
  blood_type: string;
  photo: string;
  gender: string;
}

export interface ResponseJSONUpdateChild {
  status: boolean;
  status_code: number;
  response: ResponseUpdateChild;
}

export interface ResponseUpdateChild {
  child_name: string;
  birth_date: string;
  blood_type: string;
  photo: string;
  gender: string;
  fk_id_guardian: number;
  id_child: number;
}

export interface InsertChild {
  child_name: string;
  height: number | null;
  weight: number | null;
  birth_date: string;
  blood_type: string | null;
  gender: string;
  photo: string | null;
}

export interface ResponseInsertChild {
  child_name: string;
  height: number;
  weight: number;
  birth_data: string;
  blood_type: string;
  gender: string;
  photo: string;
  fk_id_guardian: number;
}

export interface VerifyDesactivate {
  id_child: number;
  child_name: string;
}

export const getChild = async (id: number): Promise<ResponseChildId> => {
  try {
    const response = await api.get<ResponseChildId>(`/child/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Erro ao buscar os dados da criança.",
      );
    }
    throw new Error("Erro de conexão com o servidor ao buscar os dados.");
  }
};

export const getChildren = async (): Promise<ResponseChild> => {
  try {
    const response = await api.get<ResponseChild>(`/user/child`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Erro ao buscar a lista de crianças.",
      );
    }
    throw new Error("Erro de conexão com o servidor ao buscar a lista.");
  }
};

export const getChildDeactivate = async (): Promise<ResponseChild[]> => {
  try {
    const response = await api.get<ResponseChild[]>(`/user/child/deactivate`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Erro ao buscar crianças desativadas.",
      );
    }
    throw new Error(
      "Erro de conexão com o servidor ao buscar a lista de desativados.",
    );
  }
};

export const insertChild = async (
  data: InsertChild,
): Promise<ResponseInsertChild> => {
  try {
    const response = await api.post<ResponseInsertChild>(`/child`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Erro ao cadastrar a criança.",
      );
    }
    throw new Error("Erro de conexão com o servidor ao cadastrar.");
  }
};

export const updateChild = async (
  data: UpdateChild,
  childId: number,
): Promise<ResponseJSONUpdateChild> => {
  try {
    const response = await api.put<ResponseJSONUpdateChild>(
      `/child/${childId}`,
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Erro ao atualizar os dados da criança.",
      );
    }
    throw new Error("Erro de conexão com o servidor ao atualizar.");
  }
};

export const deactivateChild = async (
  childId: number,
  data: VerifyDesactivate,
): Promise<any> => {
  try {
    const response = await api.patch<any>(`/child/deactivate/${childId}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Erro ao desativar o perfil da criança.",
      );
    }
    throw new Error("Erro de conexão com o servidor ao desativar.");
  }
};

export const reactivateChild = async (childId: number): Promise<any> => {
  try {
    const response = await api.patch<any>(`/child/reactivate/${childId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Erro ao reativar o perfil da criança.",
      );
    }
    throw new Error("Erro de conexão com o servidor ao reativar.");
  }
};
