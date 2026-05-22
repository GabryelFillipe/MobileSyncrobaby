import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { AuthCard } from "../../src/components/auth/AuthCard";
import { InputPassword } from "../../src/components/auth/InputPassword";
import BtnPrimary from "../../src/components/BtnPrimary";
import { InputDefault } from "../../src/components/InputDefault";
import { LoadingBaby } from "../../src/components/Loading";
import { useLogin } from "../../src/services/hook/auth/userLogin";

export default function Login() {
  const router = useRouter();
  const { mutate: handleLoginAPI, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    api: "",
  });

  const inputStyle =
    "w-full bg-white text-gray-500 py-4 px-6 rounded-2xl shadow-sm border border-gray-100";

  const handleBlur = (field: "email" | "password", value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [field]: "Este campo é obrigatório." }));
    }
  };

  const onSubmit = () => {
    setErrors((prev) => ({ ...prev, api: "", email: "", password: "" }));

    if (!email || !password) {
      setErrors((prev) => ({
        ...prev,
        email: !email ? "Este campo é obrigatório." : prev.email,
        password: !password ? "Este campo é obrigatório." : prev.password,
      }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Formato de e-mail inválido." }));
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Mínimo de 8 caracteres, 1 maiúscula, 1 minúscula e 1 número.",
      }));
      return;
    }

    handleLoginAPI(
      { email, password },
      {
        onError: (error) => {
          setErrors((prev) => ({
            ...prev,
            api: error.message,
          }));
        },
      },
    );
  };

  return (
    <AuthCard title="Entre">
      {isPending ? (
        <LoadingBaby />
      ) : (
        <View className="flex flex-col gap-8 w-full">
          <View className="flex flex-col gap-6">
            <View className="flex flex-col gap-1">
              <InputDefault
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                className={`${inputStyle} ${errors.email ? "border-red-500 border-2" : ""}`}
                value={email}
                maxLength={255}
                onChangeText={(text) => {
                  if (text.includes(" ")) {
                    setErrors((prev) => ({
                      ...prev,
                      email: "O e-mail não pode conter espaços.",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                  setEmail(text.replace(/\s/g, ""));
                }}
                onBlur={() => handleBlur("email", email)}
              />
              {errors.email ? (
                <Text className="text-sm text-red-500 font-medium px-2 mt-1">
                  {errors.email}
                </Text>
              ) : null}
            </View>

            <View className="flex flex-col gap-2">
              <View className="flex flex-col gap-1">
                <InputPassword
                  placeholder="Senha"
                  value={password}
                  className={`${inputStyle} ${errors.password ? "border-red-500 border-2" : ""}`}
                  maxLength={15}
                  onChangeText={(text) => {
                    if (text.includes(" ")) {
                      setErrors((prev) => ({
                        ...prev,
                        password: "A senha não pode conter espaços.",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }
                    setPassword(text.replace(/\s/g, ""));
                  }}
                  onBlur={() => handleBlur("password", password)}
                />
                {errors.password ? (
                  <Text className="text-sm text-red-500 font-medium px-2 mt-1">
                    {errors.password}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                onPress={() => router.push("/resetPassword")}
                className="self-end mt-1"
              >
                <Text className="text-sm font-nunito font-semibold text-gray-400">
                  Esqueceu sua senha?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-col gap-4 mt-2">
            {errors.api ? (
              <View className="bg-lilas py-3 rounded-lg">
                <Text className="text-center text-red-500 font-bold italic">
                  {errors.api}
                </Text>
              </View>
            ) : null}

            <BtnPrimary
              text="Entrar"
              onPress={onSubmit}
              className="bg-accent py-4 rounded-xl shadow-md items-center justify-center"
              textClassName="text-white font-poppins font-bold text-lg md:text-2xl"
            />

            <TouchableOpacity
              onPress={() => router.push("/register")}
              className="w-full mt-2"
            >
              <Text className="underline text-center font-nunito font-semibold text-sm text-gray-500 md:text-lg">
                Não tem uma conta? Crie aqui
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </AuthCard>
  );
}
