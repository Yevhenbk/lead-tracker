import { notFound } from "next/navigation";

import CommentsService from "@services/server/comments-service";
import LeadsService from "@services/server/leads-service";
import LeadDetailContent from "@components/leads/lead-detail-content";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;

  try {
    const [lead, comments] = await Promise.all([
      LeadsService.getById(id),
      CommentsService.getByLeadId(id),
    ]);

    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <LeadDetailContent lead={lead} initialComments={comments} />
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
