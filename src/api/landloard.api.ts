import apiClient from "@/lib/apiClient";
import { LandlordRegistrationPayload, VerifyAccountPayload } from "@/types/auth.type";
import { PropertyResponse } from "@/types/property.type";

export function userLandloardApply(payload: LandlordRegistrationPayload) {
  return apiClient("/landloard/apply-landloard", {
    method: "POST",
    body: payload,
  });
}


export function userLandloardVerify(payload: VerifyAccountPayload) {
  return apiClient("/landloard/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function getAllLandlords() {
  return apiClient("/landloard/all-landloard", {
    method: "GET",
  });
}

export function getSingleLandlord(id: string) {
  return apiClient(`/landloard/${id}`, { 
    method: "GET",
  });
}

export interface ApproveLandlordPayload {
  landlordId: string;
  verificationStatus: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export function approveRejectLandlord(payload: ApproveLandlordPayload) {
  return apiClient("/landloard/approve-reject", {
    method: "PATCH",
    body: payload,
  });
}

export function userLanloardCreateProperty(payload: FormData) {
  return apiClient("/poperty/create-property", {
    method: "POST",
    body: payload,
  });
}

export function getMyProperty() {
  return apiClient("/poperty/my-properties", {
    method: "GET",
  });
}

export function updateProperty({
  id,
  payload,
}: {
  id: string;
  payload: FormData | Record<string, any>;
}) {
  return apiClient(`/poperty/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteProperty(id: string) {
  return apiClient(`/poperty/${id}`, {
    method: "DELETE",
  });
}


export interface GetAllPropertiesParams {
  searchTerm?: string;
  city?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  totalRooms?: number | string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function getAllProperties(params?: GetAllPropertiesParams) {
  const query = new URLSearchParams();
  if (params?.searchTerm) query.append("searchTerm", params.searchTerm);
  if (params?.city) query.append("city", params.city);
  if (params?.minPrice) query.append("minPrice", params.minPrice.toString());
  if (params?.maxPrice) query.append("maxPrice", params.maxPrice.toString());
  if (params?.totalRooms) query.append("totalRooms", params.totalRooms.toString());
  if (params?.isAvailable !== undefined) query.append("isAvailable", params.isAvailable.toString());
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

  const queryString = query.toString();
  const url = queryString
    ? `/poperty/all-properties?${queryString}`
    : "/poperty/all-properties";

  return apiClient(url, {
    method: "GET",
  });
}

export function getSingleProperty(id: string) {
  return apiClient(`/poperty/${id}`, { 
    method: "GET",
  });
}

