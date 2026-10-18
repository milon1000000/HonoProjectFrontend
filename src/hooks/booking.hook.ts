import {
  cancelBooking,
  getMyBookings,
  payBooking,
  userBooking,
} from "@/api/booking.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function usePayBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: payBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useGetMyBookings(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["my-bookings", params],
    queryFn: () => getMyBookings(params),
  });
}