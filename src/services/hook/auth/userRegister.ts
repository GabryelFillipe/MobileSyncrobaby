import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { registerService, type RegisterData } from "../../auth/auth.service";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => registerService(data),

    onSuccess: () => {
      router.replace("/login");
    },

    onError: (error: Error) => {
      console.log("ERRO DA API (Cadastro):", error.message);
    },
  });
};
