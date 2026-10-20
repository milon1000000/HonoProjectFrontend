"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import AuthLoading from "@/components/auth/auth-loading";
import { toast } from "@/components/ui/toast";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const error = searchParams.get("error");

    if (error) {
      toast.add({
        title: "Google Authentication Failed",
        description: decodeURIComponent(error),
        type: "error",
      });
      router.replace("/login");
      return;
    }

    if (accessToken && typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });

    toast.add({
      title: "Login Successful",
      description: "Welcome back!",
      type: "success",
    });

    router.replace("/");
  }, [router, searchParams, queryClient]);

  return <AuthLoading label="Completing Google sign in..." />;
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<AuthLoading label="Completing Google sign in..." />}>
      <AuthSuccessContent />
    </Suspense>
  );
}

