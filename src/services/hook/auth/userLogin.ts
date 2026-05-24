import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { loginService, type LoginData } from "../../auth/auth.service";

export const useLogin = () => {
  const router = useRouter();
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (data: LoginData) => loginService(data),

    onSuccess: async (data) => {
      const dataStorage = data.user[0];

      const token = dataStorage.token;
      const user_name = dataStorage.guardian_name;
      const id_guardian = dataStorage.id_guardian;
      const email = dataStorage.email;
      const picture = dataStorage.profile_picture || "";

      await AsyncStorage.setItem("@App:token", token);
      await AsyncStorage.setItem("user_name", user_name);
      await AsyncStorage.setItem("user_id_guardian", id_guardian.toString());
      await AsyncStorage.setItem("user_email", email);
      await AsyncStorage.setItem("user_photo", picture);

      signIn({
        id: id_guardian,
        name: user_name,
        email: email,
        photo: picture,
      });

      router.replace("/home");
    },

    onError: (error: Error) => {
      console.log("ERRO DA API:", error.message);
    },
  });
};
