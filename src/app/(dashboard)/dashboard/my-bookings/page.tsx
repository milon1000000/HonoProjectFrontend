import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardMyBookingsRedirect({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedParams)) {
    if (typeof value === "string") {
      query.set(key, value);
    }
  }

  const queryString = query.toString();
  redirect(`/user/my-booking${queryString ? `?${queryString}` : ""}`);
}

