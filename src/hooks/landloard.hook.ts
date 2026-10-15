import {
  approveRejectLandlord,
  getAllLandlords,
  getMyProperty,
  getSingleLandlord,
  updateProperty,
  deleteProperty,
  userLandloardApply,
  userLandloardVerify,
  userLanloardCreateProperty,
  getAllProperties,
  GetAllPropertiesParams,
  getSingleProperty,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLandloardApply() {
  return useMutation({
    mutationFn: userLandloardApply,
  });
}

export function useLandloardVerify() {
  return useMutation({
    mutationFn: userLandloardVerify,
  });
}

export function useGetAllLandlord() {
  return useQuery({
    queryKey: ["landlords"],
    queryFn: getAllLandlords,
  });
}

export function useGetSingleLandlord(id: string) {
  return useQuery({
    queryKey: ["landlord", id],
    queryFn: () => getSingleLandlord(id),
    enabled: !!id,
  });
}

export function useApproveRejectLandlord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveRejectLandlord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlords"] });
      queryClient.invalidateQueries({ queryKey: ["landlord"] });
    },
  });
}

export function useLanloardCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLanloardCreateProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord"] });
      queryClient.invalidateQueries({ queryKey: ["landlords"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
    },
  });
}

export function useGetMyProperty() {
  return useQuery({
    queryKey: ["my-properties"],
    queryFn: getMyProperty,
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}


export function useGetAllProperty(params?: GetAllPropertiesParams) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => getAllProperties(params),
  });
}

export function useGetSingleProperty(id: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => getSingleProperty(id),
    enabled: !!id,
  });
}