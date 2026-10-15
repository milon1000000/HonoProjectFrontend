import SingleLandlord from "@/components/landloard/singleLandloard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SingleLandlordPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-background py-10">
      <SingleLandlord id={id} />
    </main>
  );
}