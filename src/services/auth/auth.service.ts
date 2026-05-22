import { isAxiosError } from "axios";
import { api } from "../api";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  status_code: number;
  user: {
    id_guardian: number;
    guardian_name: string;
    email: string;
    profile_picture: string;
    active: number;
    token: string;
  }[];
}

export interface RegisterData {
  email: string;
  guardian_name: string;
  password: string;
}

export interface RegisterResponse {
  development: string;
  api_description: string;
  request_date: string;
  response: {
    email: string;
    guardian_name: string;
    password: string;
  };
  status: boolean;
  status_code: number;
}

export const loginService = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/user", data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        throw new Error("E-mail ou senha incorretos.");
      }
    }
    throw new Error("Falha na conexão com o servidor. Tente novamente.");
  }
};

export const registerService = async (
  data: RegisterData,
): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>("/user", data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 409 || error.response?.status === 400) {
        throw new Error("Este e-mail já está cadastrado.");
      }
    }
    throw new Error(
      "Erro ao criar conta. Verifique os dados e tente novamente.",
    );
  }
};
