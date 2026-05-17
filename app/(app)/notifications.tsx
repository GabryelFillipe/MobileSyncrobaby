import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import type { Notification } from "../../src/components/Header";

import BackIcon from "../../src/assets/icons/BackIcon.svg";
import BirthDayIcon from "../../src/assets/icons/birthdayNotification.svg";
import StorageIcon from "../../src/assets/icons/storageNotification.svg";
import TrashIcon from "../../src/assets/icons/trash.svg";
import VaccineIcon from "../../src/assets/icons/vaccineNotification.svg";

interface Props {
  visibleNotifications: boolean;
  notifications: Notification[];
  setNot: (notifications: Notification[]) => void;
  moveNotificationsBar: (state: boolean) => void;
}

function Notifications({
  visibleNotifications,
  moveNotificationsBar,
  notifications,
  setNot,
}: Props) {
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

  function deleteNotification(id: number) {
    const newNot = notifications.filter((n: Notification) => n.id !== id);
    setNot(newNot);
  }

  function deleteAllNotications() {
    setNot([]);
  }

  function getNotificationIconSource(type: string) {
    if (type === "vacine") return VaccineIcon;
    if (type === "storage") return StorageIcon;
    return BirthDayIcon;
  }

  return (
    <View
      className={`absolute px-6 pt-10 pb-34 top-0 w-full h-full z-50 bg-light
        md:px-14 md:mt-0
        xl:w-1/3 xl:min-w-90 xl:top-0 xl:right-0 xl:mt-0 xl:py-10 xl:border-l-4 xl:border-primary
        ${visibleNotifications ? "flex" : "hidden"}`}
    >
      <View className="flex flex-row justify-between items-center gap-3">
        <View className="flex flex-row items-center gap-2">
          <TouchableOpacity onPress={() => moveNotificationsBar(false)}>
            {renderIcon(BackIcon, {
              accessibilityLabel: "Icone que oculta barra de notificações.",
              className: "rotate-0 w-auto h-6",
            })}
          </TouchableOpacity>
          <Text className="font-poppins text-text-primary font-bold text-2xl">
            Notificações
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => deleteAllNotications()}
          className="flex flex-row w-32 h-9 justify-center items-center gap-2 rounded-lg bg-accent border-2 border-accent-dark"
        >
          {renderIcon(TrashIcon, {
            accessible: false,
            className: "w-auto h-2.5",
          })}
          <Text className="font-poppins font-bold text-sm text-white">
            Ler todas
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 mt-14">
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          {notifications.map((notification: Notification) => (
            <View
              key={notification.id}
              className="flex flex-row w-full h-28 p-2 gap-3 rounded-sm border-2 border-primary overflow-hidden"
            >
              <View className="flex flex-col justify-between w-auto">
                {renderIcon(getNotificationIconSource(notification.type), {
                  accessible: false,
                  className: "w-12 h-12 p-2 rounded-lg border-2 border-primary",
                })}
                <Text className="font-nunito text-primary-darker text-sm">
                  15 min
                </Text>
              </View>

              <View className="flex flex-col flex-1 h-full justify-between items-end">
                <View className="w-full">
                  <Text className="font-poppins font-bold text-text-primary text-[1rem]">
                    {notification.title}
                  </Text>
                </View>

                <Text
                  numberOfLines={2}
                  className="w-full bg-blu font-nunito grow pt-1 text-primary-dark font-extralight text-[0.9rem]"
                >
                  {notification.description}
                </Text>

                <TouchableOpacity
                  onPress={() => deleteNotification(notification.id)}
                >
                  {renderIcon(TrashIcon, {
                    accessibilityLabel: "Icone para excluir uma notificação.",
                    className: "w-auto h-4 md:h-5",
                  })}
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <Text
            className={`w-full mt-[50%] font-bold text-primary text-xl text-center ${
              notifications.length === 0 ? "flex" : "hidden"
            }`}
          >
            Está tudo tão calmo, como uma soneca da tarde...
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

export default Notifications;
