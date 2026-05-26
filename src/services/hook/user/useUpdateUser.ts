import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deactivateUser,
  getUser,
  reactivateUser,
  updatePassword,
  updateProfilePicture,
  updateUser,
} from "../../user/user.service";

export function useGetUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useUpdateProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useDeactivateUser() {
  return useMutation({
    mutationFn: deactivateUser,
  });
}

export function useReactivateUser() {
  return useMutation({
    mutationFn: reactivateUser,
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: updatePassword,
  });
}
