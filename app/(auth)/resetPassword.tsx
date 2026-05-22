import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

import BtnPrimary from "../../src/components/BtnPrimary";
import { InputDefault } from "../../src/components/InputDefault";
import { AuthCard } from "../../src/components/auth/AuthCard";
import { InputPassword } from "../../src/components/auth/InputPassword";

export default function ResetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
      email: "",
      password: "",
      confirmPassword: "",
      api: "",
    };

    if (!email) {
      newErrors.email = "Este campo é obrigatório.";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "Este campo é obrigatório.";
      hasError = true;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Este campo é obrigatório.";
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem.";
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

    setIsPending(true);

    setTimeout(() => {
      setIsPending(false);
      router.replace("/login");
    }, 1500);
  };

  return (
    <AuthCard title="Recupere sua senha">
      <View className="flex flex-col gap-6 w-full">
        <View className="flex flex-col gap-1">
          <InputDefault
            placeholder="E-mail"
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
            placeholder="Nova Senha"
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
            placeholder="Confirme sua senha"
            className={`${inputStyle} ${errors.confirmPassword ? "border-red-500 border-2" : ""}`}
            value={confirmPassword}
            maxLength={15}
            onChangeText={(text) => {
              if (text.includes(" ")) {
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: "A senha não pode conter espaços.",
                }));
              } else {
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }
              setConfirmPassword(text.replace(/\s/g, ""));
            }}
            onBlur={() => handleBlur("confirmPassword", confirmPassword)}
          />
          {errors.confirmPassword ? (
            <Text className="text-sm text-red-500 font-medium px-2 mt-1">
              {errors.confirmPassword}
            </Text>
          ) : null}
        </View>

        <View className="flex flex-row justify-between mt-4 gap-4 w-full">
          <BtnPrimary
            text="Cancelar"
            onPress={() => router.push("/login")}
            className="flex-1 items-center justify-center py-4 bg-white border border-gray-200 rounded-xl shadow-sm"
            textClassName="text-darker-purple font-poppins font-bold text-base md:text-xl"
            disabled={isPending}
          />

          <BtnPrimary
            text={isPending ? "Alterando..." : "Alterar senha"}
            onPress={onSubmit}
            disabled={isPending}
            className={`flex-1 items-center justify-center py-4 bg-accent rounded-xl shadow-md ${
              isPending ? "opacity-70" : ""
            }`}
            textClassName="text-white font-poppins font-bold text-base md:text-xl"
          />
        </View>

        {errors.api ? (
          <View className="bg-red-100 py-3 rounded-lg mt-2">
            <Text className="text-center text-red-500 font-bold italic">
              {errors.api}
            </Text>
          </View>
        ) : null}
      </View>
    </AuthCard>
  );
}
