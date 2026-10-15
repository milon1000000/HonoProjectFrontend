"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMe } from "@/hooks";
import AuthLoading from "@/components/auth/auth-loading";

export default function DashboardRedirect() {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();
  const user = data?.data;

  useEffect(() => {
    if (isPending) return;

    if (isError || !user) {
      router.replace("/login");
      return;
    }

    if (user.role === "ADMIN") {
      router.replace("/admin");
    } else if (user.role === "LANDLORD") {
      router.replace("/landlord");
    } else {
      router.replace("/user");
    }
  }, [isPending, isError, user, router]);

  return <AuthLoading label="Redirecting to your dashboard..." />;
}

