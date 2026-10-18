import apiClient from "@/lib/apiClient";
import {
  CreateRoomInput,
  GetAllRoomsParams,
  UpdateRoomInput,
} from "@/types/room.type";

export function userLanloardCreateRoom(payload: CreateRoomInput) {
  return apiClient("/room/create-room", {
    method: "POST",
    body: payload,
  });
}

export async function getPropertyRoom(id: string) {
  try {
    return await apiClient(`/property/${id}`, { 
      method: "GET",
    });
  } catch (error: any) {
    if (error?.status === 404 || error?.statusCode === 404) {
      return await apiClient(`/poperty/${id}`, { 
        method: "GET",
      });
    }
    throw error;
  }
}

export function getSingleRoom(id: string) {
  return apiClient(`/room/${id}`, { 
    method: "GET",
  });
}

export function updateRoom({
  id,
  payload,
}: {
  id: string;
  payload: UpdateRoomInput | Record<string, any>;
}) {
  return apiClient(`/room/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteRoom(id: string) {
  return apiClient(`/room/${id}`, {
    method: "DELETE",
  });
}

export function allRooms(params?: GetAllRoomsParams) {
  const query = new URLSearchParams();
  if (params?.searchTerm) query.append("searchTerm", params.searchTerm);
  if (params?.city) query.append("city", params.city);
  if (params?.status) query.append("status", params.status);
  if (params?.propertyId) query.append("propertyId", params.propertyId);
  if (params?.minRentAmount) query.append("minRentAmount", params.minRentAmount.toString());
  if (params?.maxRentAmount) query.append("maxRentAmount", params.maxRentAmount.toString());
  if (params?.capacity) query.append("capacity", params.capacity.toString());
  if (params?.availableSeats) query.append("availableSeats", params.availableSeats.toString());
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

  const queryString = query.toString();
  const url = queryString ? `/room/all-rooms?${queryString}` : `/room/all-rooms`;

  return apiClient(url, {
    method: "GET",
  });
}