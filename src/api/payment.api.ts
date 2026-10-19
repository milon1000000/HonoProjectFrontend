import apiClient from "@/lib/apiClient";

export function getMyPayments(params?: Record<string, any>) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("SortOrder", params.sortOrder);

  const queryString = query.toString();
  const url = queryString
    ? `/payment/my-payments?${queryString}`
    : "/payment/my-payments";

  return apiClient(url, {
    method: "GET",
  });
}

export function getAllPayments(params?: Record<string, any>) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.tenantEmail) query.append("tenantEmail", params.tenantEmail);
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("SortOrder", params.sortOrder);

  const queryString = query.toString();
  const url = queryString
    ? `/payment/all-payments?${queryString}`
    : "/payment/all-payments";

  return apiClient(url, {
    method: "GET",
  });
}

export function getSinglePayment(paymentId: string) {
  return apiClient(`/payment/${paymentId}`, {
    method: "GET",
  });
}