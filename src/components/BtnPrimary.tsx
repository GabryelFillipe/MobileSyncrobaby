import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface PropsBtnPrimary extends TouchableOpacityProps {
  text: string;
  className?: string;
}

export function BtnPrimary({
  text,
  className = "",
  ...props
}: PropsBtnPrimary) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`rounded-sm py-2 px-3 ${className}`}
      {...props}
    >
      <Text className="font-poppins">{text}</Text>
    </TouchableOpacity>
  );
}

export default BtnPrimary;
