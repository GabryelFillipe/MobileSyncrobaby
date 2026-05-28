import { useQuery } from "@tanstack/react-query";
import type { ResponseChildId } from "../../children/children.service";
import { getChild } from "../../children/children.service";

export const useGetChild = (idChild: number) => {
  return useQuery<ResponseChildId>({
    queryKey: ["child", idChild],

    queryFn: async () => {
      const response = await getChild(idChild);
      return response;
    },

    enabled: !!idChild && idChild > 0,
  });
};
