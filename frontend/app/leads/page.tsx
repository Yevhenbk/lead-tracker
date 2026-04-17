import { Suspense } from "react";

import LeadsService from "@services/server/leads-service";
import LeadsPageContent from "@components/leads/leads-page-content";
import LeadsLoading from "./loading";

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

async function LeadsList({ searchParams }: { searchParams: SearchParams }) {
  const queryParams: Record<string, string> = {};

  if (searchParams.page) queryParams.page = searchParams.page;
  if (searchParams.limit) queryParams.limit = searchParams.limit;
  if (searchParams.status) queryParams.status = searchParams.status;
  if (searchParams.q) queryParams.q = searchParams.q;
  if (searchParams.sort) queryParams.sort = searchParams.sort;
  if (searchParams.order) queryParams.order = searchParams.order;

  try {
    const leadsResponse = await LeadsService.getAll(queryParams);

    return (
      <LeadsPageContent leadsResponse={leadsResponse} currentParams={searchParams} />
    );
  } catch {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">
          Failed to load leads. Make sure the backend is running.
        </p>
      </div>
    );
  }
}

export default async function LeadsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        </div>
        <Suspense fallback={<LeadsLoading />}>
          <LeadsList searchParams={resolvedParams} />
        </Suspense>
      </div>
    </main>
  );
}
