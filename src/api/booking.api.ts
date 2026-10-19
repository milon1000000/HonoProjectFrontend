import apiClient from "@/lib/apiClient";
import {
  IBookingPayload,
  IPayBookingPayload,
  ICancelBookingPayload,
} from "@/types/booking.type";

export function userBooking(payload: IBookingPayload) {
  return apiClient("/booking/booking-room", {
    method: "POST",
    body: payload,
  });
}

export function payBooking(payload: IPayBookingPayload) {
  return apiClient("/booking/pay-booking", {
    method: "POST",
    body: payload,
  });
}

export function cancelBooking(payload: ICancelBookingPayload) {
  return apiClient("/booking/cancel-booking", {
    method: "POST",
    body: payload,
  });
}

export function getMyBookings(params?: Record<string, any>) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.status) query.append("status", params.status);

  const queryString = query.toString();
  const url = queryString
    ? `/booking/my-bookings?${queryString}`
    : "/booking/my-bookings";

  return apiClient(url, {
    method: "GET",
  });
}

export function userAllBooking(params?: Record<string, any>) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.status) query.append("status", params.status);
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

  const queryString = query.toString();
  const url = queryString
    ? `/booking/all-bookings?${queryString}`
    : "/booking/all-bookings";

  return apiClient(url, {
    method: "GET",
  });
}