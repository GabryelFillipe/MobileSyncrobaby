import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";

import NotificationsPage from "../../app/(app)/notifications";
import { InputDefault } from "../components/InputDefault";
import { useAuth } from "../context/AuthContext";
import { useGetNotificationUser } from "../services/hook/notification/useGetNotificationUser";

import Notifications from "../assets/icons/notifications.svg";
import Search from "../assets/icons/search.svg";
import Profile from "../assets/navigation/profileHeader.svg";
import SetBack from "../assets/navigation/setBack.svg";

export default function Header() {
  const { user } = useAuth();
  const userName = user?.name || "";

  const { data: notificationsData } = useGetNotificationUser();
  const notifications = notificationsData?.notification || [];

  const [visibleNotifications, setVisibleNotifications] =
    useState<boolean>(false);
  const [previousNotifCount, setPreviousNotifCount] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [newNotifMessage, setNewNotifMessage] = useState<string>("");

  const toastAnimation = useRef(new Animated.Value(-150)).current;

  const pathname = usePathname();
  const router = useRouter();

  const unreadCount = notifications.filter((n: any) => !n.read_status).length;

  useEffect(() => {
    if (notifications.length > previousNotifCount && previousNotifCount !== 0) {
      const latestNotif = notifications[0];
      setNewNotifMessage(latestNotif?.title || "Nova notificação recebida!");

      setShowToast(true);
      Animated.sequence([
        Animated.timing(toastAnimation, {
          toValue: 40,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(toastAnimation, {
          toValue: -150,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => setShowToast(false));
    }
    setPreviousNotifCount(notifications.length);
  }, [notifications.length]);

  function moveNoticationsBar() {
    setVisibleNotifications(!visibleNotifications);
  }

  function getTitle(path?: string | null): string {
    if (!path || path === "/" || path.includes("home")) return "Home";
    const p = path.toLowerCase();

    if (p.includes("newanotation")) return "Nova lembrança";
    if (p.includes("anotationdiary")) return "Anotação";
    if (p.includes("diary")) return "Diário";
    if (p.includes("addstorage")) return "Adicionar produto";
    if (p.includes("storage")) return "Estoque";
    if (p.includes("articles")) return "Dicas";
    if (p.includes("article")) return "Artigo";

    if (p.includes("addprofessional") || p.includes("add-professional"))
      return "Adicionar Profissional";
    if (p.includes("editprofessional") || p.includes("professional/"))
      return "Editar Profissional";
    if (p.includes("professional") || p.includes("pediatrician"))
      return "Profissionais";

    if (p.includes("addillness")) return "Adicionar condições de saúde";

    if (p.includes("editillness") || p.match(/\/(illness)\/\d+/))
      return "Editar condição de saúde";

    if (p.includes("health") || p.includes("illness"))
      return "Condições de Saúde";
    if (p.includes("updatemeasure") || p.includes("update-measure"))
      return "Atualizar medidas";
    if (p.includes("measure")) return "Medidas";
    if (p.includes("addchild") || p.includes("add-child"))
      return "Adicionar Filho(a)";
    if (p.includes("routines")) return "Rotinas";
    if (p.includes("feeding")) return "Alimentacão";
    if (p.includes("routinesleep")) return "Sono";
    if (p.includes("diaper")) return "Fraldas";
    if (p.includes("vaccines")) return "Vacinas";
    if (p.includes("shower")) return "Banho";
    if (p.includes("medicine")) return "Medicação";
    return "";
  }

  const title = getTitle(pathname);
  const isHome = title === "Home";

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
    <View className="flex flex-col justify-between w-full px-6 pt-12 pb-4 bg-light z-50">
      {showToast && (
        <Animated.View
          style={{
            transform: [{ translateY: toastAnimation }],
            zIndex: 100,
            elevation: 100,
            position: "absolute",
            top: 0,
            left: 24,
            right: 24,
          }}
          className="bg-accent rounded-lg p-4 shadow-lg flex flex-col justify-center"
        >
          <Text className="text-white font-poppins font-bold text-sm">
            Nova Notificação
          </Text>
          <Text className="text-white font-nunito text-xs mt-1">
            {newNotifMessage}
          </Text>
        </Animated.View>
      )}

      <View
        className={`flex flex-row items-center w-full h-11 rounded-2xl bg-lilas px-4 ${
          !isHome ? "hidden" : "flex"
        }`}
      >
        {renderIcon(Search, { className: "w-4 h-4" })}
        <InputDefault
          placeholder="Buscar..."
          className="flex-1 pl-3 font-poppins text-primary-text"
        />
      </View>

      <View className="flex flex-row w-full justify-between items-center mt-6">
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
          <View className="justify-center mt-1 mb-1">
            <Text className="font-poppins font-bold text-base text-primary-text leading-tight">
              Olá,
            </Text>
            <Text className="font-poppins font-bold text-lg text-primary leading-tight">
              {userName.trim()}!
            </Text>
          </View>
        )}

        <View className="flex flex-row gap-5 items-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={moveNoticationsBar}
            hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
            className="relative"
          >
            {renderIcon(Notifications, { className: "w-15 h-15" })}
            {unreadCount > 0 && (
              <View className="absolute -top-2 -right-2 min-w-6 h-6 bg-accent px-0.5 rounded-full border border-white justify-center items-center">
                <Text
                  numberOfLines={1}
                  className="text-white font-bold text-[9px] leading-none text-center"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="w-11 h-11 rounded-full overflow-hidden justify-center items-center"
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
      />
    </View>
  );
}
