import apiClient from "@/lib/apiClient";
import {
  IUsersApiResponse,
  IUsersQuery,
  UserStatus,
} from "@/types/user.type";

export function getAllUsers(query?: IUsersQuery): Promise<IUsersApiResponse> {
  const params = new URLSearchParams();
  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));
  if (query?.searchTerm) params.set("searchTerm", query.searchTerm);
  if (query?.role && query.role !== "ALL") params.set("role", query.role);
  if (query?.status && query.status !== "ALL") params.set("status", query.status);
  if (query?.sortBy) params.set("sortBy", query.sortBy);
  if (query?.SortOrder) params.set("SortOrder", query.SortOrder);

  const qs = params.toString();
  return apiClient(`/admin/all-users${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });
}

export function blockUnblockUser(id: string, status?: UserStatus) {
  return apiClient(`/admin/block-unblock/${id}`, {
    method: "PATCH",
    body: status ? { status } : {},
  });
}

export function deleteUser(id: string) {
  return apiClient(`/admin/delete-user/${id}`, {
    method: "PATCH",
  });
}
