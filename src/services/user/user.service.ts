import { isAxiosError } from "axios";
import { api } from "../api";
import type { LoginResponse } from "../auth/auth.service";

export interface UpdateUser {
  guardian_name: string;
  email: string;
}

interface UpdateResponse {
  status_code: number;
  user: {
    guardian_name: string;
    email: string;
    profile_picture: string;
    id_guardian: number;
  };
}

interface VerifyPassword {
  password: string;
}

interface VerifyEmailPass {
  email: string;
  password: string;
}

interface ResponseReactivate {
  id_guardian: number;
  token: string;
}

interface UpdatePassword {
  current_password: string;
  new_password: string;
}

export const getUser = async (): Promise<LoginResponse> => {
  try {
    const response = await api.get<LoginResponse>("/user");
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response) {
      throw new Error("Não foi possível carregar os dados do usuário.");
    }
    throw new Error("Falha na conexão com o servidor. Tente novamente.");
  }
};

export const updateUser = async (data: UpdateUser): Promise<UpdateResponse> => {
  try {
    const response = await api.put<UpdateResponse>("/user", data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error("Este e-mail já está sendo utilizado por outra conta.");
      }
      throw new Error(
        error.response?.data?.message || "Erro ao atualizar o perfil.",
      );
    }
    throw new Error("Falha na conexão com o servidor. Tente novamente.");
  }
};

export const updateProfilePicture = async (data: FormData): Promise<void> => {
  try {
    await api.patch("/user/profile-picture", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erro ao atualizar a foto de perfil.",
      );
    }
    throw new Error("Falha na conexão com o servidor. Tente novamente.");
  }
};

export const deactivateUser = async (data: VerifyPassword): Promise<any> => {
  try {
    const response = await api.patch<any>("/deactivate/user", data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Senha incorreta. Ação não autorizada.");
      }
      throw new Error("Erro ao desativar conta.");
    }
    throw new Error("Falha na conexão com o servidor. Tente novamente.");
  }
};

export const reactivateUser = async (
  data: VerifyEmailPass,
): Promise<ResponseReactivate> => {
  try {
    const response = await api.patch<ResponseReactivate>(
      "/reactivate/user",
      data,
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        throw new Error("E-mail ou senha incorretos.");
      }
      throw new Error("Erro ao reativar conta.");
    }
    throw new Error("Falha na conexão com o servidor. Tente novamente.");
  }
};

export const updatePassword = async (data: UpdatePassword): Promise<any> => {
  try {
    const response = await api.patch<any>("/user/password", data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("A senha atual está incorreta.");
      }
      throw new Error("Erro ao atualizar a senha.");
    }
    throw new Error("Falha na conexão com o servidor. Tente novamente.");
  }
};
