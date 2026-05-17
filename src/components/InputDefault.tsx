import { TextInput, type TextInputProps } from "react-native";

interface InputProps extends Omit<TextInputProps, "className"> {
  className?: string[] | string;
}

export function InputDefault({ className, ...rest }: InputProps) {
  const treatedClasses = Array.isArray(className)
    ? className.join(" ")
    : className;

  return <TextInput className={treatedClasses} {...rest} />;
}
