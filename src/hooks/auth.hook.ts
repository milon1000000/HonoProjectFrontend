import {  getMe, logout, updateProfile, userForgotPassword, userLogin, userRegistration, userResetPassword, userVerification} from "@/api/auth.api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

export function useVerification(){
  return useMutation({
    mutationFn:userVerification
  })
}

export function useLogout(){
  return useMutation({
    mutationFn:logout
  })
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await getMe();
      if (res?.data && typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(`profile_extra_${res.data.id}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (res.data.role === "TENANT") {
              res.data.tenant = {
                ...res.data.tenant,
                contactNumber:
                  res.data.tenant?.contactNumber || parsed.contactNumber || null,
                address: res.data.tenant?.address || parsed.address || null,
              };
            } else if (res.data.role === "LANDLORD") {
              res.data.landlord = {
                ...res.data.landlord,
                contactNumber:
                  res.data.landlord?.contactNumber || parsed.contactNumber || null,
                address: res.data.landlord?.address || parsed.address || null,
              };
            }
          }
        } catch {
          // ignore
        }
      }
      return res;
    },
    retry: false,
  });
}

export function useUpdateProfile(){
  return useMutation({
    mutationFn:updateProfile
  })
}

export function useForgotPassword(){
  return useMutation({
    mutationFn:userForgotPassword
  })
}

export function useResetPassword(){
  return useMutation({
    mutationFn:userResetPassword
  })
}