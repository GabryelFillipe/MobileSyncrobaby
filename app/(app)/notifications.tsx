import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useDeleteNotification } from "../../src/services/hook/notification/useDeleteNotification";
import { usePatchNotificationRead } from "../../src/services/hook/notification/usePatchNotificationRead";

import BackIcon from "../../src/assets/icons/BackIcon.svg";
import BirthDayIcon from "../../src/assets/icons/birthdayNotification.svg";
import StorageIcon from "../../src/assets/icons/storageNotification.svg";
import TrashIcon from "../../src/assets/icons/trash.svg";
import VaccineIcon from "../../src/assets/icons/vaccineNotification.svg";

interface Props {
  visibleNotifications: boolean;
  notifications: any[];
  moveNotificationsBar: (state: boolean) => void;
}

function Notifications({
  visibleNotifications,
  moveNotificationsBar,
  notifications,
}: Props) {
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteNotification();
  const readMutation = usePatchNotificationRead();

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

  function handleDelete(id: number) {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notification"] });
      },
    });
  }

  function handleReadAll() {
    notifications.forEach((notif) => {
      if (!notif.read_status) {
        readMutation.mutate(notif.id_notification, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification"] });
          },
        });
      }
    });
  }

  function handleReadSingle(notification: any) {
    if (!notification.read_status) {
      readMutation.mutate(notification.id_notification, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notification"] });
        },
      });
    }
  }

  function getNotificationIconSource(typeId: number) {
    if (typeId === 1) return VaccineIcon;
    if (typeId === 2) return StorageIcon;
    return BirthDayIcon;
  }

  return (
    <Modal
      visible={visibleNotifications}
      animationType="slide"
      transparent={false}
      onRequestClose={() => moveNotificationsBar(false)}
    >
      <View className="flex-1 bg-light px-6 pt-10 pb-6">
        <View className="flex flex-row justify-between items-center gap-3 mt-4">
          <View className="flex flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => moveNotificationsBar(false)}
              className="p-2 -ml-2"
            >
              {renderIcon(BackIcon, {
                className: "rotate-0 w-auto h-6",
              })}
            </TouchableOpacity>
            <Text className="font-poppins text-text-primary font-bold text-2xl">
              Notificações
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleReadAll}
            className="flex flex-row w-32 h-9 justify-center items-center gap-2 rounded-lg bg-accent border-2 border-accent-dark"
          >
            {renderIcon(TrashIcon, {
              className: "w-auto h-2.5",
              fill: "#FFFFFF",
            })}
            <Text className="font-poppins font-bold text-sm text-white">
              Ler todas
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 mt-8">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingBottom: 40 }}
          >
            {notifications.map((notification: any) => (
              <TouchableOpacity
                key={notification.id_notification}
                activeOpacity={0.9}
                onPress={() => handleReadSingle(notification)}
                className={`flex flex-row w-full p-3 gap-3 rounded-md border-2 ${
                  notification.read_status
                    ? "border-gray-200 bg-white"
                    : "border-primary bg-lilas"
                } overflow-hidden`}
              >
                <View className="flex flex-col justify-start items-center w-auto gap-2">
                  {renderIcon(
                    getNotificationIconSource(
                      notification.fk_id_notification_type,
                    ),
                    {
                      className: `w-12 h-12 p-2 rounded-lg border-2 ${
                        notification.read_status
                          ? "border-gray-200"
                          : "border-primary"
                      }`,
                    },
                  )}
                  <Text className="font-nunito text-primary-darker text-xs font-bold">
                    Agora
                  </Text>
                </View>

                <View className="flex flex-col flex-1 justify-between items-end gap-2">
                  <View className="w-full">
                    <Text
                      className={`font-poppins font-bold text-[1rem] ${
                        notification.read_status
                          ? "text-gray-400"
                          : "text-text-primary"
                      }`}
                    >
                      {notification.title}
                    </Text>
                  </View>

                  <Text
                    numberOfLines={2}
                    className={`w-full font-nunito text-[0.9rem] ${
                      notification.read_status
                        ? "text-gray-400"
                        : "text-primary-dark"
                    }`}
                  >
                    {notification.message}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleDelete(notification.id_notification)}
                    className="p-1"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {renderIcon(TrashIcon, {
                      className: "w-auto h-5",
                    })}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            {notifications.length === 0 && (
              <Text className="w-full mt-20 font-bold text-primary text-lg text-center px-4">
                Está tudo tão calmo, como uma soneca da tarde...
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default Notifications;
