import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import Fem from "../../assets/profileChildren/fem.svg";
import Male from "../../assets/profileChildren/male.svg";
import DateUtils from "../../utils/Date";

import type { Props } from "../Perfil";

function DataBar({
  child,
  readonly,
  genderSelected,
  setGenderSelected,
}: Props) {
  return (
    <View className="flex-row items-center w-full h-16 bg-white rounded-xl shadow-purple-sm">
      <View className="flex-1 flex-row justify-center items-center h-full gap-2">
        {(child?.gender === "male" || !readonly) && (
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={readonly}
            onPress={() => setGenderSelected?.("male")}
            className={`justify-center items-center w-10 h-10 rounded-lg ${
              genderSelected === "male" && !readonly
                ? "bg-lilas/80 border border-primary"
                : ""
            }`}
          >
            <Male width={24} height={24} />
          </TouchableOpacity>
        )}

        {(child?.gender === "female" || !readonly) && (
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={readonly}
            onPress={() => setGenderSelected?.("female")}
            className={`justify-center items-center w-10 h-10 rounded-lg ${
              genderSelected === "female" && !readonly
                ? "bg-lilas/80 border border-primary"
                : ""
            }`}
          >
            <Fem width={24} height={30} />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 justify-center items-center h-[70%] border-x border-primary">
        <Text className="font-bold font-poppins text-primary-text text-sm">
          {child?.birth_date
            ? `${DateUtils.subYearsFormated(child.birth_date)} anos`
            : "0 anos"}
        </Text>
      </View>

      <View className="flex-1 justify-center items-center h-[70%]">
        <Text className="font-bold font-poppins text-primary-text text-sm">
          {`IMC: ${child?.BMI == null ? 0 : child?.BMI}`}
        </Text>
      </View>
    </View>
  );
}

export default DataBar;
