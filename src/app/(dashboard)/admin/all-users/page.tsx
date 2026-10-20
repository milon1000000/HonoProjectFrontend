import React from "react";
import AllUsers from "@/components/users/allUsers";

export const metadata = {
  title: "All Users Management | Admin Dashboard",
  description:
    "View and manage all registered users, block/unblock accounts, and oversee platform access.",
};

export default function AllUsersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AllUsers />
    </div>
  );
}
