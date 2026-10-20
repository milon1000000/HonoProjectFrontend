import {
  blockUnblockUser,
  deleteUser,
  getAllUsers,
} from "@/api/admin.api";
import { IUsersQuery, UserStatus } from "@/types/user.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllUsers(query?: IUsersQuery) {
  return useQuery({
    queryKey: ["admin-users", query],
    queryFn: () => getAllUsers(query),
  });
}

export function useBlockUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status?: UserStatus }) =>
      blockUnblockUser(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
