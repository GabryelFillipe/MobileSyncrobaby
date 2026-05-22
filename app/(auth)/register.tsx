import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { AuthCard } from "../../src/components/auth/AuthCard";
import { InputPassword } from "../../src/components/auth/InputPassword";
import BtnPrimary from "../../src/components/BtnPrimary";
import { InputDefault } from "../../src/components/InputDefault";
import { LoadingBaby } from "../../src/components/Loading";
import { useRegister } from "../../src/services/hook/auth/userRegister";

export default function Register() {
  const router = useRouter();
  const { mutate: handleRegisterAPI, isPending } = useRegister();

  const [guardian_name, setGuardianName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassWord, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    guardian_name: "",
    email: "",
    password: "",
    confirmPassWord: "",
    api: "",
  });

  const inputStyle =
    "w-full bg-white text-gray-500 py-4 px-6 rounded-2xl shadow-sm border border-gray-100";

  const handleBlur = (field: keyof typeof errors, value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [field]: "Este campo é obrigatório." }));
    }
  };

  const onSubmit = () => {
    let hasError = false;
    const newErrors = {
      guardian_name: "",
      email: "",
      password: "",
      confirmPassWord: "",
      api: "",
    };

    if (!guardian_name) {
      newErrors.guardian_name = "Este campo é obrigatório.";
      hasError = true;
    }
    if (!email) {
      newErrors.email = "Este campo é obrigatório.";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "Este campo é obrigatório.";
      hasError = true;
    }
    if (!confirmPassWord) {
      newErrors.confirmPassWord = "Este campo é obrigatório.";
      hasError = true;
    } else if (password !== confirmPassWord) {
      newErrors.confirmPassWord = "As senhas não coincidem.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
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

    handleRegisterAPI(
      { email, guardian_name, password },
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
    <AuthCard title="Criar Conta">
      {isPending ? (
        <LoadingBaby />
      ) : (
        <View className="flex flex-col gap-4 w-full">
          <View className="flex flex-col gap-1">
            <InputDefault
              placeholder="Nome completo"
              autoCapitalize="words"
              className={`${inputStyle} ${errors.guardian_name ? "border-red-500 border-2" : ""}`}
              value={guardian_name}
              maxLength={150}
              onChangeText={(text) => {
                setGuardianName(text);
                setErrors((prev) => ({ ...prev, guardian_name: "" }));
              }}
              onBlur={() => handleBlur("guardian_name", guardian_name)}
            />
            {errors.guardian_name ? (
              <Text className="text-sm text-red-500 font-medium px-2 mt-1">
                {errors.guardian_name}
              </Text>
            ) : null}
          </View>

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

          <View className="flex flex-col gap-1">
            <InputPassword
              placeholder="Senha"
              className={`${inputStyle} ${errors.password ? "border-red-500 border-2" : ""}`}
              value={password}
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

          <View className="flex flex-col gap-1">
            <InputPassword
              placeholder="Confirmar senha"
              className={`${inputStyle} ${errors.confirmPassWord ? "border-red-500 border-2" : ""}`}
              value={confirmPassWord}
              maxLength={15}
              onChangeText={(text) => {
                if (text.includes(" ")) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassWord: "A senha não pode conter espaços.",
                  }));
                } else {
                  setErrors((prev) => ({ ...prev, confirmPassWord: "" }));
                }
                setConfirmPassword(text.replace(/\s/g, ""));
              }}
              onBlur={() => handleBlur("confirmPassWord", confirmPassWord)}
            />
            {errors.confirmPassWord ? (
              <Text className="text-sm text-red-500 font-medium px-2 mt-1">
                {errors.confirmPassWord}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="w-full mt-2"
          >
            <Text className="underline text-center font-nunito font-semibold text-sm text-gray-500 md:text-lg">
              Já tem uma conta? Entre aqui
            </Text>
          </TouchableOpacity>

          <View className="flex flex-col gap-4 mt-2">
            {errors.api ? (
              <View className="bg-red-100 py-3 rounded-lg">
                <Text className="text-center text-red-500 font-bold italic">
                  {errors.api}
                </Text>
              </View>
            ) : null}

            <BtnPrimary
              text="Cadastrar"
              onPress={onSubmit}
              className="bg-accent py-4 rounded-xl shadow-md items-center justify-center"
              textClassName="text-white font-poppins font-bold text-lg md:text-2xl"
            />
          </View>
        </View>
      )}
    </AuthCard>
  );
}
