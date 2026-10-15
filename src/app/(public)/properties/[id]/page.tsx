import React from "react";
import SingleProperty from "@/components/landloard/singleProperty";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <SingleProperty id={id} />;
}
