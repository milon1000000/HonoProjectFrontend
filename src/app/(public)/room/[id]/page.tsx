import React from "react";
import SingleRoom from "@/components/room/singleRoom";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SingleRoomPage({ params }: PageProps) {
  const { id } = await params;
  return <SingleRoom id={id} />;
}



