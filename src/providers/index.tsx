"use client";

import { ReactNode } from "react";
import QueryProvider from "./query.provider";
import { Toaster } from "@/components/ui/toast";

export default function Providers({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}
  <Toaster />
  </QueryProvider>;
}

