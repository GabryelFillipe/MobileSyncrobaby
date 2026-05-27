import { TextInput, type TextInputProps } from "react-native";

type InputType = "text" | "email" | "password" | "number" | "date";

interface InputProps extends Omit<TextInputProps, "className"> {
  className?: string[] | string;
  type?: InputType;
}

export function InputDefault({
  className,
  type = "text",
  style,
  ...rest
}: InputProps) {
  const treatedClasses = Array.isArray(className)
    ? className.join(" ")
    : className;

  let keyboardType: TextInputProps["keyboardType"] = "default";
  let secureTextEntry = false;

  switch (type) {
    case "email":
      keyboardType = "email-address";
      break;
    case "number":
      keyboardType = "numeric";
      break;
    case "date":
      keyboardType = "numeric";
      break;
    case "password":
      secureTextEntry = true;
      break;
    default:
      keyboardType = "default";
  }

  return (
    <TextInput
      className={treatedClasses}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={[{ paddingVertical: 0, textAlignVertical: "center" }, style]}
      {...rest}
    />
  );
}