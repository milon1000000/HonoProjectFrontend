import {
  allRooms,
  deleteRoom,
  getPropertyRoom,
  getSingleRoom,
  updateRoom,
  userLanloardCreateRoom,
} from "@/api/room.api";
import { GetAllRoomsParams } from "@/types/room.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLanloardCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLanloardCreateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });
}

export function useGetPropertyRoom(id: string) {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: () => getPropertyRoom(id),
    enabled: !!id,
  });
}

export function useGetSingleRoom(id: string) {
  return useQuery({
    queryKey: ["room", id],
    queryFn: () => getSingleRoom(id),
    enabled: !!id,
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
    },
  });
}


export function useGetAllRooms(params?: GetAllRoomsParams) {
  return useQuery({
    queryKey: ["rooms", params],
    queryFn: () => allRooms(params),
  });
}