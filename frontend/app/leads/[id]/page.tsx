import LeadDetailContent from "@components/leads/lead-detail-content";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <LeadDetailContent leadId={id} />
      </div>
    </main>
  );
}
