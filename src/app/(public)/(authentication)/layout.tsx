import GuestGuard from "@/components/auth/guest-guard";
import { ReactNode } from "react";

export default function AuthenticationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <GuestGuard>{children}</GuestGuard>;
}

