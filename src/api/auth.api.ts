import apiClient from "@/lib/apiClient";
import {
  ITenantRegistrationPayload,
  LoginPayload,
  VerifyAccountPayload,
} from "@/types/auth.type";

export function userLogin(payload: LoginPayload) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}

export function userRegistration(payload: ITenantRegistrationPayload) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}

export function userVerification(payload: VerifyAccountPayload) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}

export function getMe() {
  return apiClient("/user/me");
}

export function logout() {
  return apiClient("/auth/logout", { method: "POST" });
}


export function getNewAccessToken() {
  return apiClient("/auth/refresh-token", { 
    method: "POST" 
  });
}

export function updateProfile(payload: FormData) {
  return apiClient("/user/update-profile", {
    method: "PATCH",
    body: payload,
  });
}

