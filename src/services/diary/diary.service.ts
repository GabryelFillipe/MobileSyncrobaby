import { AxiosError } from "axios";
import { api } from "../api";

export interface Diary {
  id_diary_note: number;
  title: string;
  content: string;
  media: string;
  date: string;
  color: string;
  fk_id_child: number;
}

export interface InsertDiary {
  title: string;
  content: string;
  media: string;
  date: string;
  color: string;
  fk_id_child: number;
}

export interface ResponseDiary {
  status_code: number;
  diary: Diary[];
}

export interface ResponseUpdateDiary {
  status_code: number;
  diary: InsertDiary;
}

export interface ResponseInsertDiary {
  status_code: number;
}

export interface ResponseDeleteDiary {
  status_code: number;
  message: string;
}

export const getDiary = async (childId: number): Promise<ResponseDiary> => {
  try {
    const response = await api.get<ResponseDiary>(`/diary/child/${childId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Erro ao buscar os registros do diário.",
      );
    }
    throw new Error("Erro de conexão com o servidor ao buscar o diário.");
  }
};

export const insertDiary = async (
  data: FormData,
): Promise<ResponseInsertDiary> => {
  try {
    const response = await api.post<ResponseInsertDiary>(`/diary`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Erro ao criar o registro no diário.",
      );
    }
    throw new Error("Erro de conexão com o servidor ao criar o registro.");
  }
};

export const updateDiary = async (
  data: FormData,
  idDiary: number,
): Promise<ResponseUpdateDiary> => {
  try {
    const response = await api.put<ResponseUpdateDiary>(
      `/diary/${idDiary}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message ||
          "Erro ao atualizar o registro no diário.",
      );
    }
    throw new Error("Erro de conexão com o servidor ao atualizar o registro.");
  }
};

export const deleteDiary = async (
  idDiary: number,
): Promise<ResponseDeleteDiary> => {
  try {
    const response = await api.delete<ResponseDeleteDiary>(`/diary/${idDiary}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Erro ao deletar o registro no diário.",
      );
    }
    throw new Error("Erro de conexão com o servidor ao deletar o registro.");
  }
};
