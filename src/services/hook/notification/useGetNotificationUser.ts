import { useQuery } from "@tanstack/react-query";
import type { ResponseGetNotificationByUser } from "../../notification/notification.service";
import { getNotificationByUser } from "../../notification/notification.service";

export const useGetNotificationUser = () => {
  return useQuery<ResponseGetNotificationByUser>({
    queryKey: ["notification"],
    queryFn: async () => {
      return await getNotificationByUser();
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: false,
  });
};
