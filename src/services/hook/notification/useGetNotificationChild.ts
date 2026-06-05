import { useQuery } from "@tanstack/react-query";
import { getNotificationByChild } from "../../notification/notification.service";
import type { ResponseGetNotificationByChild } from "../../notification/notification.service";

export const useGetNotificationChild = (id_child: number) => {
    return useQuery<ResponseGetNotificationByChild>({
      queryKey: ["notification", "id_child", id_child],
      queryFn: async () => {
        return await getNotificationByChild(id_child);
      }
    });
};