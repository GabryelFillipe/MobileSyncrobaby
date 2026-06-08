import { useQuery } from "@tanstack/react-query";
import {
  getChildDeactivate,
  type ResponseChild,
} from "../../children/children.service";

export const useGetChildDeactivate = () => {
  return useQuery<ResponseChild[], Error>({
    queryKey: ["childDeactivate"],
    queryFn: getChildDeactivate,
  });
};
