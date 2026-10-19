import {
  getAllPayments,
  getMyPayments,
  getSinglePayment,
} from "@/api/payment.api";
import { useQuery } from "@tanstack/react-query";

export function useGetMyPayments(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["my-payments", params],
    queryFn: () => getMyPayments(params),
  });
}

export function useGetAllPayments(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getAllPayments(params),
  });
}

export function useGetSinglePayment(paymentId: string) {
  return useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => getSinglePayment(paymentId),
    enabled: Boolean(paymentId),
  });
}