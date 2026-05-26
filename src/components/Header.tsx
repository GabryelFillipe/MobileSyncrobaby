import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import NotificationsPage from "../../app/(app)/notifications";
import { InputDefault } from "../components/InputDefault";
import { useAuth } from "../context/AuthContext";
import DateUtils from "../utils/Date";

import Notifications from "../assets/icons/notifications.svg";
import Search from "../assets/icons/search.svg";
import Profile from "../assets/navigation/profileHeader.svg";
import SetBack from "../assets/navigation/setBack.svg";

export interface Notification {
  id: number;
  title: string;
  type: string;
  description: string;
}

export default function Header() {
  const { user } = useAuth();
  const userName = user?.name || "";

  const [DateHour, setDateHour] = useState<string>(DateUtils.getHourFormated());
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Lembrete de Vacina: amanhã!",
      type: "vacine",
      description:
        "Olá! A sua vacina Febre Amarela está agendada para dia 28/02/2026",
    },
  ]);

  const { width } = useWindowDimensions();
  const [windowWidth, setWindowWidth] = useState<boolean>(width <= 1279);
  const [visibleNotifications, setVisibleNotifications] =
    useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();

  function moveNoticationsBar() {
    setVisibleNotifications(!visibleNotifications);
  }

  function getTitle(path?: string | null): string {
    if (!path || path === "/" || path.includes("home")) return "Home";
    const p = path.toLowerCase();

    if (p.includes("newanotation")) return "Nova lembrança";
    if (p.includes("anotationdiary")) return "Anotação";
    if (p.includes("diary")) return "Diário";
    if (p.includes("add-storage")) return "Adicionar produto";
    if (p.includes("storage")) return "Estoque";
    if (p.includes("articles")) return "Dicas";
    if (p.includes("article")) return "Artigo";
    if (p.includes("addprofessional")) return "Adicionar Profissional";
    if (p.includes("editprofessional")) return "Editar Profissional";
    if (p.includes("pediatrician")) return "Profissionais";
    if (p.includes("add-illness")) return "Adicionar Enfermidade";
    if (p.includes("edit-illness")) return "Editar enfermidade";
    if (p.includes("health")) return "Enfermidades";
    if (p.includes("updatemeasure")) return "Atualizar medidas";
    if (p.includes("measures")) return "Medidas";
    if (p.includes("addchild") || p.includes("add-child"))
      return "Adicionar Filho(a)";
    if (p.includes("routines")) return "Rotinas";
    if (p.includes("feeding")) return "Alimentacão";
    if (p.includes("sleep")) return "Sono";
    if (p.includes("diaper")) return "Fraldas";
    if (p.includes("vaccines")) return "Vacinas";
    if (p.includes("shower")) return "Banho";
    if (p.includes("medicine")) return "Medicação";
    return "";
  }

  const title = getTitle(pathname);
  const isHome = title === "Home";

  useEffect(() => {
    setWindowWidth(width <= 1279);
  }, [width]);

  useEffect(() => {
    const handleTime = setInterval(() => {
      setDateHour(DateUtils.getHourFormated());
    }, 60000);
    return () => clearInterval(handleTime);
  }, []);

  const renderIcon = (iconSource: any, props: any) => {
    if (typeof iconSource === "function") {
      const SvgIcon = iconSource;
      return <SvgIcon {...props} />;
    }
    return (
      <Image
        source={
          typeof iconSource === "string" ? { uri: iconSource } : iconSource
        }
        {...props}
      />
    );
  };

  return (
    <View
      className={`flex flex-col justify-between w-screen px-6 pt-16 pb-6 z-90 bg-light md:px-14 xl:h-24 xl:flex-row xl:px-20 xl:pt-8 xl:items-start`}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={moveNoticationsBar}
        className={`xl:absolute xl:top-0 xl:z-80 xl:right-0 xl:w-screen xl:h-screen xl:bg-black/60 xl:backdrop-blur-[1px] ${visibleNotifications ? "xl:flex" : "hidden"}`}
      />

      <View
        className={`flex flex-row items-center w-full h-9 rounded-2xl bg-lilas px-2 ${!isHome && windowWidth ? "hidden" : "flex"} md:h-11 xl:w-2/3`}
      >
        {renderIcon(Search, { className: "w-4 h-4" })}
        <InputDefault className="flex-1 pl-2 font-poppins text-primary-text" />
      </View>

      <View className="flex flex-row w-full justify-between items-center mt-4 xl:justify-end xl:gap-16 xl:h-11 xl:mt-0">
        <Text className="hidden xl:flex xl:font-nunito xl:text-black/50 xl:font-bold">
          {DateHour}
        </Text>

        {!isHome ? (
          <View className="flex flex-row items-center gap-3">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {renderIcon(SetBack, { className: "w-6 h-6" })}
            </TouchableOpacity>
            <Text className="text-primary-text font-poppins font-bold text-2xl">
              {title}
            </Text>
          </View>
        ) : (
          <View className="justify-center mt-2 mb-2 xl:hidden">
            <Text className="font-poppins font-bold text-base text-primary-text">
              Olá,
            </Text>
            <Text className="font-poppins font-bold text-lg text-primary ml-2">
              {userName.trim()}!
            </Text>
          </View>
        )}

        <View className="flex flex-row gap-4 items-center z-50">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={moveNoticationsBar}
            hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
            className="mt-1"
          >
            {renderIcon(Notifications, { className: "w-6 h-6 md:h-8 md:w-8" })}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full overflow-hidden justify-center items-cente"
            onPress={() => router.push("/profileUser")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {user?.photo ? (
              <Image
                source={{ uri: user.photo }}
                className="w-full h-full object-cover"
              />
            ) : (
              <Profile width={24} height={24} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <NotificationsPage
        visibleNotifications={visibleNotifications}
        moveNotificationsBar={moveNoticationsBar}
        notifications={notifications}
        setNot={setNotifications}
      />
    </View>
  );
}
