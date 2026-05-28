import { LoadingBaby } from "@/src/components/Loading";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import EditIcon from "../../../src/assets/icons/editIcon.svg";
import ExportIcon from "../../../src/assets/icons/exportIcon.svg";
import Blood from "../../../src/assets/profileChildren/blood.svg";
import Cancel from "../../../src/assets/profileChildren/cancel.svg";
import Confirm from "../../../src/assets/profileChildren/confirm.svg";
import DateBirth from "../../../src/assets/profileChildren/date.svg";
import Height from "../../../src/assets/profileChildren/height.svg";
import Sick from "../../../src/assets/profileChildren/sick.svg";
import Vaccine from "../../../src/assets/profileChildren/vaccine.svg";
import Weight from "../../../src/assets/profileChildren/weight.svg";
import Trash from "../../../src/assets/routines/trashPurple.svg";
import BtnPrimary from "../../../src/components/BtnPrimary";
import { InputDefault } from "../../../src/components/InputDefault";
import Perfil from "../../../src/components/Perfil";
import AtributesProfile from "../../../src/components/profileChildren/AtributesProfile";
import type {
  Children,
  VerifyDesactivate,
} from "../../../src/services/children/children.service";
import { useDeactivateChild } from "../../../src/services/hook/children/useDeactivateChild";
import { useGetChild } from "../../../src/services/hook/children/useGetChild";
import { useUpdateChild } from "../../../src/services/hook/children/useUpdateChild";
import DateUtils from "../../../src/utils/Date";

export interface DataChild extends Children {
  vaccine?: string;
  sick?: string;
}

export interface ListDescription {
  title: string;
  img: any;
  value?: string;
  aria?: string;
  path?: string;
}

interface FormChild {
  child_name: string;
  birth_date: string;
  blood_type: string;
}

export default function ProfileChildren() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idChild = Number(params.id);

  const { data: childData } = useGetChild(idChild);
  const { mutate: updateChild, isPending: isUpdating } = useUpdateChild();
  const { mutate: onDeleteChild, isPending: isDeleting } = useDeactivateChild();

  const refProfile = useRef<ViewShot>(null);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [onlyRead, setOnlyRead] = useState<boolean>(true);
  const [photoUri, setPhotoUri] = useState<string>("");

  const [dataChildren, setDataChildren] = useState<DataChild | null>(null);
  const [genderSelected, setGenderSelected] = useState<string>("");

  const [descriptionItems, setDescriptionItems] = useState<ListDescription[]>([
    { title: "Data de nascimento:", img: DateBirth },
    { title: "Peso:", img: Weight, path: "/update-measures" },
    { title: "Altura:", img: Height, path: "/update-measures" },
    { title: "Vacinação:", img: Vaccine, path: "/vaccines" },
    { title: "Enfermidades:", img: Sick, path: "/health" },
    { title: "Tipo sanguíneo:", img: Blood },
  ]);

  const { control, handleSubmit, setValue, getValues, reset } =
    useForm<FormChild>({
      defaultValues: {
        child_name: "",
        birth_date: "",
        blood_type: "",
      },
    });

  const {
    control: deleteControl,
    handleSubmit: deleteSubmit,
    formState: { errors: deleteErrors },
    reset: resetDelete,
  } = useForm<VerifyDesactivate>({ defaultValues: { child_name: "" } });

  useEffect(() => {
    if (childData?.child && childData.child.length > 0) {
      const child = childData.child[0];
      const newData: DataChild = {
        ...child,
        birth_date: child.birth_date.split("T")[0],
        height: Math.round(child.height),
        vaccine: "Nenhuma vacina aplicada",
        sick: "Nenhuma enfermidade",
      };

      setDataChildren(newData);
      setGenderSelected(newData.gender);
      setPhotoUri(newData.photo || "");

      reset({
        child_name: newData.child_name,
        birth_date: newData.birth_date,
        blood_type: newData.blood_type,
      });

      setDescriptionItems((prevItems) =>
        prevItems.map((it) => {
          if (it.title === "Data de nascimento:")
            it.value = DateUtils.formatedDate(newData.birth_date);
          else if (it.title === "Peso:") it.value = `${newData.weight} Kg`;
          else if (it.title === "Altura:") it.value = `${newData.height} cm`;
          else if (it.title === "Vacinação:") it.value = newData.vaccine;
          else if (it.title === "Enfermidades:") it.value = newData.sick;
          else if (it.title === "Tipo sanguíneo:")
            it.value = newData.blood_type;
          return it;
        }),
      );
    }
  }, [childData, reset]);

  async function pickImage() {
    if (onlyRead) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function shareProfile() {
    try {
      if (refProfile.current?.capture) {
        const uri = await refProfile.current.capture();
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, { dialogTitle: "Perfil da Criança" });
        } else {
          Alert.alert(
            "Ops!",
            "Compartilhamento não disponível neste dispositivo.",
          );
        }
      }
    } catch {
      Alert.alert("Erro", "Não foi possível gerar a imagem do perfil.");
    }
  }

  function sendDatas(data: FormChild) {
    if (!dataChildren) return;

    const formData = new FormData();
    formData.append("child_name", data.child_name);
    formData.append("birth_date", data.birth_date);
    formData.append("blood_type", data.blood_type);
    formData.append("gender", genderSelected);

    if (photoUri && photoUri !== dataChildren.photo) {
      const filename = photoUri.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("photo", {
        uri: photoUri,
        name: filename,
        type: type,
      } as any);
    }

    updateChild(
      { formData: formData, childId: idChild },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Alterações salvas!");
          setOnlyRead(true);
        },
        onError: () => {
          Alert.alert("Erro", "Não foi possível salvar as alterações.");
        },
      },
    );
  }

  function cancelChanges() {
    if (dataChildren) {
      setValue("child_name", dataChildren.child_name);
      setValue("birth_date", dataChildren.birth_date);
      setValue("blood_type", dataChildren.blood_type);
      setGenderSelected(dataChildren.gender);
      setPhotoUri(dataChildren.photo || "");
    }
    setOnlyRead(true);
  }

  function deleteChild(data: VerifyDesactivate) {
    if (dataChildren && getValues("child_name") !== data.child_name) {
      Alert.alert("Erro", "Nome incorreto. Tente novamente!");
    } else {
      onDeleteChild(
        { child_name: data.child_name, id_child: idChild },
        {
          onSuccess: () => {
            Alert.alert("Sucesso", "Criança desativada!");
            setDeleteModal(false);
            router.replace("/");
          },
          onError: () => {
            Alert.alert("Erro", "Não foi possível desativar a criança.");
          },
        },
      );
    }
  }

  if (!dataChildren) {
    return (
      <View className="flex-1 justify-center items-center bg-light">
        <LoadingBaby message="Carregando dados do seu Bebê..." />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View>
          <ViewShot ref={refProfile} options={{ format: "jpg", quality: 0.9 }}>
            <View className="items-center py-2 z-99 relative">
              <View className="absolute top-2 left-6 right-6 flex-row justify-between z-20">
                <TouchableOpacity
                  onPress={shareProfile}
                  hitSlop={{ top: 10, bottom: 0, left: 10, right: 10 }}
                >
                  <ExportIcon width={24} height={24} />
                </TouchableOpacity>

                <View className="flex-row gap-4">
                  {!onlyRead && (
                    <TouchableOpacity onPress={cancelChanges}>
                      <Cancel width={20} height={20} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      onlyRead ? setOnlyRead(false) : handleSubmit(sendDatas)()
                    }
                  >
                    {onlyRead ? (
                      <EditIcon width={24} height={24} />
                    ) : (
                      <Confirm width={20} height={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                className="absolute top-2 right-16 z-20"
                onPress={() => setDeleteModal(true)}
              >
                <Trash width={24} height={24} />
              </TouchableOpacity>

              <Controller
                control={control}
                name="child_name"
                rules={{ required: "Nome é obrigatório" }}
                render={({ field: { onChange, value } }) => (
                  <Perfil
                    child={dataChildren}
                    isChildProfile={true}
                    readonly={onlyRead}
                    genderSelected={genderSelected}
                    setGenderSelected={setGenderSelected}
                    nameValue={value}
                    onNameChange={onChange}
                  />
                )}
              />

              {!onlyRead && (
                <TouchableOpacity
                  onPress={pickImage}
                  className="absolute top-2 w-32 h-32 rounded-full z-30 justify-center items-center bg-black/20"
                >
                  <Text className="text-white font-bold text-xs">
                    Mudar Foto
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ViewShot>

          <View className="px-6 py-0">
            {descriptionItems.map((item) => (
              <Controller
                key={item.title}
                control={control}
                name={
                  item.title === "Data de nascimento:"
                    ? "birth_date"
                    : item.title === "Tipo sanguíneo:"
                      ? "blood_type"
                      : (`dummy_${item.title}` as any)
                }
                render={({ field: { onChange, value } }) => (
                  <AtributesProfile
                    listDescription={item}
                    onlyRead={onlyRead}
                    dateValue={
                      item.title === "Data de nascimento:" ? value : undefined
                    }
                    onDateChange={
                      item.title === "Data de nascimento:"
                        ? onChange
                        : undefined
                    }
                    bloodValue={
                      item.title === "Tipo sanguíneo:" ? value : undefined
                    }
                    onBloodChange={
                      item.title === "Tipo sanguíneo:" ? onChange : undefined
                    }
                  />
                )}
              />
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={deleteModal} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-lilas-bg w-full rounded-2xl p-6 items-center">
            <Text className="text-primary-text font-bold text-lg text-center mb-1 font-poppins">
              Deseja desativar esta criança?
            </Text>
            <Text className="text-primary-darker text-sm text-center mb-4 font-nunito">
              Ela poderá ser reativada no menu de filhos
            </Text>

            <Controller
              control={deleteControl}
              name="child_name"
              rules={{ required: "Digite o nome da criança para confirmar." }}
              render={({ field: { onChange, value } }) => (
                <InputDefault
                  placeholder="Digite o nome da criança..."
                  value={value}
                  onChangeText={onChange}
                  className="bg-white rounded-lg px-4 h-12 w-full mb-2 border border-gray-200"
                />
              )}
            />
            {deleteErrors.child_name && (
              <Text className="text-red-500 text-xs self-start ml-1 mb-4 font-poppins">
                {deleteErrors.child_name.message}
              </Text>
            )}

            <View className="flex-row w-full justify-between gap-4 mt-2">
              <BtnPrimary
                text="Cancelar"
                onPress={() => {
                  setDeleteModal(false);
                  resetDelete();
                }}
                className="flex-1 bg-white border border-gray-200"
                textClassName="text-gray-700 font-bold"
              />
              <BtnPrimary
                text={isDeleting ? "Desativando..." : "Confirmar"}
                onPress={deleteSubmit(deleteChild)}
                disabled={isDeleting}
                className="flex-1 bg-accent"
                textClassName="text-white font-bold"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
