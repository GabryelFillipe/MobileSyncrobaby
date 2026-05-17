import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import NotificationsPage from "../../app/(app)/notifications";
import { InputDefault } from "../components/InputDefault";
// import DateUtils from "../utils/Date";

import Notifications from "../assets/icons/notifications.svg";
import Search from "../assets/icons/search.svg";
import Profile from "../assets/navigation/profileHeader.svg";
import SetBack from "../assets/navigation/setBack.svg";
import SetBackProfile from "../assets/profileChildren/setBackProfile.svg";

export interface Notification {
  id: number;
  title: string;
  type: string;
  description: string;
}

function Header() {
  //   const [DateHour, setDateHour] = useState<string>(DateUtils.getDateFormated());
  const [userName, setUserName] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Lembrete de Vacina: amanhã!",
      type: "vacine",
      description:
        "Olá! A sua vacina Febre Amarela está agendada para dia 28/02/2026",
    },
    {
      id: 2,
      title: "Fraldas acabando!",
      type: "storage",
      description: "Olá! Seu item: Fraldas acabará em breve!",
    },
    {
      id: 3,
      title: "Aniversário a vista!",
      type: "birthday",
      description: "Parabéns! Pedro completará 2 aninhos em 3 dias!",
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

  function setTitleHeader(path: string) {
    if (path === "/home" || path === "/") return "Home";
    if (path === "/routines") return "Rotinas";
    if (path === "/feeding") return "Alimentacão";
    if (path === "/storage") return "Estoque";
    if (path === "/add-storage") return "Adicionar produto";
    if (path === "/sleep") return "Sono";
    if (path === "/health") return "Enfermidades";
    if (path === "/pediatrician") return "Profissionais";
    if (path === "/diaper") return "Fraldas";
    if (path === "/vaccines") return "Vacinas";
    if (path === "/shower") return "Banho";
    if (path === "/medicine") return "Medicação";
    if (path === "/profile-children") return "";
    if (path === "/articles") return "Dicas";
    if (path === "/add-child") return "Adicionar Filho(a)";
    if (path.includes("/article/")) return "Artigo";
    if (path === "/edit-pediatrician") return "Editar Profissional";
    if (path === "/add-illness") return "Adicionar Enfermidade";
    if (path === "/measures") return "Medidas";
    if (path === "/update-measures") return "Atualizar medidas";
    if (path === "/profile-user") return "Perfil";
    if (path.includes("/edit-illness/")) return "Editar enfermidade";
    if (path === "/diary") return "Diário";
    if (path.includes("/anotation-diary/")) return "Anotação";
    if (path === "/new-anotation") return "Nova lembrança";
    return "";
  }

  useEffect(() => {
    setWindowWidth(width <= 1279);
  }, [width]);

  useEffect(() => {
    const fetchUser = async () => {
      const name = await AsyncStorage.getItem("user_name");
      if (name) setUserName(name);
    };
    fetchUser();

    // const handleTime = setInterval(() => {
    //   setDateHour(DateUtils.getDateFormated());
    // }, 60000);

    // return () => clearInterval(handleTime);
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
      className={`fixed top-0 flex flex-col justify-between items-center w-screen px-6 pt-6 z-90 bg-light ${setTitleHeader(pathname) !== "Home" ? "h-24" : "h-32"} md:px-14 xl:h-24 xl:flex-row xl:px-20 xl:pt-8 xl:items-start xl:right-0 ${pathname === "/profile-children" || pathname === "/profile-user" ? "xl:w-[80%]" : "xl:w-[85%] xl:max-w-[calc(100%-200px)]"}`}
    >
      <Pressable
        onPress={moveNoticationsBar}
        className={`xl:absolute xl:top-0 xl:z-80 xl:right-0 xl:w-screen xl:h-screen xl:bg-black/60 xl:backdrop-blur-[1px]  ${visibleNotifications ? "xl:flex" : "hidden"}`}
      />

      <Pressable
        onPress={() => router.back()}
        className={`xl:ml-58 ${(pathname === "/profile-children" && !windowWidth) || (pathname === "/profile-user" && !windowWidth) ? "flex" : "hidden"}`}
      >
        {renderIcon(SetBackProfile, { alt: "Retorna a tela anterior." })}
      </Pressable>

      <View
        className={`flex flex-row items-center w-full h-9 rounded-2xl bg-lilas shadow-purple-sm px-2 ${(setTitleHeader(pathname) !== "Home" && windowWidth) || pathname === "/profile-children" || pathname === "/profile-user" ? "hidden" : "flex"} md:h-11 xl:w-2/3`}
      >
        {renderIcon(Search, { "aria-hidden": "true", className: "w-4 h-4" })}
        <InputDefault className="flex-1 pl-2 font-poppins text-primary-text" />
      </View>

      <View className="flex flex-row w-full justify-between items-center mt-4 xl:justify-end xl:gap-16 xl:h-11 xl:mt-0">
        <Text className="hidden xl:flex xl:font-nunito xl:text-black/50 xl:font-bold">
          12:00
        </Text>

        <View
          className={`flex flex-row items-center gap-3 ${setTitleHeader(pathname) !== "Home" && windowWidth ? "flex" : "hidden"}`}
        >
          <Pressable onPress={() => router.back()}>
            {renderIcon(SetBack, {
              alt: "Icone para voltar a tela anterior.",
              className: "w-6 h-6",
            })}
          </Pressable>
          <Text className={`text-text-primary font-poppins font-bold text-2xl`}>
            {setTitleHeader(pathname)}
          </Text>
        </View>

        <Text
          className={`font-inter font-bold text-md ${setTitleHeader(pathname) !== "Home" ? "hidden" : "flex"} md:text-lg xl:hidden`}
        >
          Olá{"\n"}
          <Text className="text-primary font-bold">{userName} !</Text>
        </Text>

        <View className="flex flex-row gap-4 items-center">
          <View className="relative">
            <Pressable
              onPress={moveNoticationsBar}
              className="flex justify-center items-center"
            >
              <View
                className={`absolute justify-center items-center rounded-full bg-primary w-5.5 h-5.5 -right-2 -top-2 z-90 ${notifications.length !== 0 ? "flex" : "hidden"} md:h-6 md:w-6`}
              >
                <Text className="font-bold text-white text-[14px]">
                  {notifications.length}
                </Text>
              </View>
              {renderIcon(Notifications, {
                alt: "Icone de redirecionamento para notificações.",
                className: `w-6 h-6 ${notifications.length !== 0 ? "animate-bell" : ""} md:h-8 md:w-8`,
              })}
            </Pressable>
          </View>

          <Link href="/" asChild>
            <Pressable
              className={`w-7 h-7 -mt-px md:h-8 md:w-8 md:mt-0 xl:hidden ${pathname === "/profile-children" || pathname === "/profile-user" ? "hidden" : "flex"}`}
            >
              {renderIcon(Profile, {
                alt: "Icone de perfil de usuário.",
                className: "w-full h-full",
              })}
            </Pressable>
          </Link>
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

export default Header;
