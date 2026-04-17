import LeadsPageContent from "@components/leads/leads-page-content";

interface SearchParams {
  page?: string;
  limit?: string;
  status?: string;
  q?: string;
  sort?: string;
  order?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function LeadsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-ink-900">Leads</h1>
        </div>
        <LeadsPageContent currentParams={resolvedParams} />
      </div>
    </main>
  );
}
