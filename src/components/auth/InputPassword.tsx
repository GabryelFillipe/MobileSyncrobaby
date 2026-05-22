import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { InputDefault } from "../../../src/components/InputDefault";

import RevealPasswordIcon from "../../../src/assets/icons/revealPassword.svg";

interface InputPasswordProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  maxLength?: number;
}

export function InputPassword({
  placeholder = "Senha",
  className = "",
  ...rest
}: InputPasswordProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <View className="relative w-full justify-center">
      <InputDefault
        placeholder={placeholder}
        secureTextEntry={!isPasswordVisible}
        className={`pr-14 ${className}`}
        autoCapitalize="none"
        {...rest}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleVisibility}
        className="absolute right-4 z-10 p-2"
      >
        <RevealPasswordIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
}
