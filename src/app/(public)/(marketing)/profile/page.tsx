"use client";

import React from "react";
import { useGetMe } from "@/hooks";
import { ProfileView } from "@/components/profile/ProfileView";

export default function ProfilePage() {
  const { data, isLoading } = useGetMe();

  return <ProfileView user={data?.data} isLoading={isLoading} />;
}