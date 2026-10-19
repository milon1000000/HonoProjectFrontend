import {
  getAdminAnalytic,
  getLandlordAnalytic,
  getTenantAnalytic,
} from "@/api/analytic.api";
import { useQuery } from "@tanstack/react-query";

export function useGetTenantAnalytics() {
  return useQuery({
    queryKey: ["my-analytic"],
    queryFn: () => getTenantAnalytic(),
  });
}

export function useGetLandlordAnalytics() {
  return useQuery({
    queryKey: ["landlord-analytic"],
    queryFn: () => getLandlordAnalytic(),
  });
}

export function useGetAdminAnalytics() {
  return useQuery({
    queryKey: ["admin-analytic"],
    queryFn: () => getAdminAnalytic(),
  });
}