import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  deactivateChild,
  type VerifyDesactivate,
} from "../../children/children.service";

export const useDeactivateChild = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<any, Error, VerifyDesactivate>({
    mutationFn: (data: VerifyDesactivate) =>
      deactivateChild(data.id_child, data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      router.back();
      return data;
    },
  });
};
