import { useQuery } from "@tanstack/react-query";
import { getNotificationById } from "../../notification/notification.service";
import type { ResponseGetNotificationById } from "../../notification/notification.service";

export const useGetNotificationId = (id_notification: number) => {
    return useQuery<ResponseGetNotificationById>({
      queryKey: ["notification", "id_notification", id_notification],
      queryFn: async () => {
        return await getNotificationById(id_notification);
      }
    });
};