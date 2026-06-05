import { useQuery } from "@tanstack/react-query";
import { getNotificationByUser } from "../../notification/notification.service";
import type { ResponseGetNotificationByUser } from "../../notification/notification.service";

export const useGetNotificationUser= () => {
    return useQuery<ResponseGetNotificationByUser>({
      queryKey: ["notification"],
      queryFn: async () => {
        return await getNotificationByUser();
      }
    });
};