// src/components/Perfil.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import ProfilePicture from "../assets/profileChildren/profilePicture.svg";
import { InputDefault } from "../components/InputDefault";
import Databar from "../components/profileChildren/DataBar";

export interface DataChild {
  id_child: number;
  child_name: string;
  height: number;
  weight: number;
  birth_date: string;
  BMI: null | number;
  blood_type: string;
  gender: string;
  photo: string;
  active: number;
  fk_id_guardian: number;
  vaccine?: string;
  sick?: string;
}

export interface Props {
  child?: DataChild;
  readonly?: boolean;
  setGenderSelected?: (gender: string) => void;
  genderSelected?: string;
  nameValue?: string;
  onNameChange?: (value: string) => void;
  isChildProfile?: boolean;
}

function Perfil({
  child,
  nameValue,
  onNameChange,
  readonly,
  genderSelected,
  setGenderSelected,
  isChildProfile = true,
}: Props) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("usuário");

  useEffect(() => {
    async function loadUserData() {
      if (!isChildProfile) {
        const photo = await AsyncStorage.getItem("user_photo");
        const name = await AsyncStorage.getItem("user_name");
        setUserPhoto(photo && photo !== "null" ? photo : null);
        setUserName(name || "usuário");
      }
    }
    loadUserData();
  }, [isChildProfile]);

  return (
    <View className="flex-col items-center w-full py-4 z-10">
      <View className="w-32 h-32 mt-2 rounded-full border-4 border-lilas-dark overflow-hidden bg-white justify-center items-center">
        {isChildProfile ? (
          child?.photo ? (
            <Image
              source={{ uri: child.photo }}
              className="w-full h-full object-cover"
            />
          ) : (
            <ProfilePicture width={80} height={80} />
          )
        ) : userPhoto ? (
          <Image
            source={{ uri: userPhoto }}
            className="w-full h-full object-cover"
          />
        ) : (
          <ProfilePicture width={80} height={80} />
        )}
      </View>

      <View className="flex-row w-full items-center justify-center mt-4 px-6">
        {isChildProfile ? (
          <InputDefault
            type="text"
            placeholder="Nome da criança"
            editable={!readonly}
            value={nameValue || ""}
            onChangeText={onNameChange}
            onBlur={() => {}}
            style={{ textAlign: "center" }}
            className={`w-full text-2xl text-primary-text font-bold font-poppins ${
              !readonly
                ? "bg-white rounded-xl py-2 px-4 border border-gray-200"
                : ""
            }`}
          />
        ) : (
          <Text className="text-2xl text-primary-text font-bold font-poppins text-center">
            Olá, {userName}
          </Text>
        )}
      </View>

      {isChildProfile && (
        <View className="w-full mt-4 px-4 flex-row justify-center">
          <Databar
            setGenderSelected={setGenderSelected}
            genderSelected={genderSelected}
            child={child}
            readonly={readonly}
          />
        </View>
      )}
    </View>
  );
}

export default Perfil;
