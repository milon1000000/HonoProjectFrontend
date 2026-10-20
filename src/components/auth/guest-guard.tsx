"use client";

import { useGetMe } from "@/hooks";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import AuthLoading from "./auth-loading";

export default function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (user) {
      const redirectPath =
        user?.role === "ADMIN"
          ? "/"
          : user?.role === "LANDLORD"
            ? "/"
            : "/";
      router.replace(redirectPath);
    }
  }, [isPending, user, router]);

  if (isPending) {
    return <AuthLoading label="Checking authentication..." />;
  }

  if (user) {
    return <AuthLoading label="Redirecting..." />;
  }

  return <>{children}</>;
}

