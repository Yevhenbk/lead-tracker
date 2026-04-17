import LeadsService from "@services/server/leads-service";
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

  const queryParams: Record<string, string> = {};

  if (resolvedParams.page) queryParams.page = resolvedParams.page;
  if (resolvedParams.limit) queryParams.limit = resolvedParams.limit;
  if (resolvedParams.status) queryParams.status = resolvedParams.status;
  if (resolvedParams.q) queryParams.q = resolvedParams.q;
  if (resolvedParams.sort) queryParams.sort = resolvedParams.sort;
  if (resolvedParams.order) queryParams.order = resolvedParams.order;

  try {
    const leadsResponse = await LeadsService.getAll(queryParams);

    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          </div>
          <LeadsPageContent
            leadsResponse={leadsResponse}
            currentParams={resolvedParams}
          />
        </div>
      </main>
    );
  } catch {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">
              Failed to load leads. Make sure the backend is running.
            </p>
          </div>
        </div>
      </main>
    );
  }
}
