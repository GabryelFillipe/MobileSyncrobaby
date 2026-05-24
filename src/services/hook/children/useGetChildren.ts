import { useQuery } from "@tanstack/react-query";
import {
  getChildren,
  type ResponseChild,
} from "../../children/children.service";

export const useGetChildren = () => {
  return useQuery<ResponseChild>({
    queryKey: ["children"],
    queryFn: () => getChildren(),
  });
};
