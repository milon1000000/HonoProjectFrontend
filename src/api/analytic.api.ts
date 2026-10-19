import apiClient from "@/lib/apiClient";
import {
  AdminAnalyticsData,
  ApiResponse,
  LandlordAnalyticsData,
  TenantAnalyticsData,
} from "@/types/analytics.type";

export function getTenantAnalytic(): Promise<ApiResponse<TenantAnalyticsData>> {
  return apiClient("/analytics/tenant", {
    method: "GET",
  });
}

export function getLandlordAnalytic(): Promise<
  ApiResponse<LandlordAnalyticsData>
> {
  return apiClient("/analytics/landlord", {
    method: "GET",
  });
}

export function getAdminAnalytic(): Promise<ApiResponse<AdminAnalyticsData>> {
  return apiClient("/analytics/admin", {
    method: "GET",
  });
}