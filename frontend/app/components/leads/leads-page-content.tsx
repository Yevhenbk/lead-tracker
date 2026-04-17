"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Lead, LeadListResponse } from "@models/lead";
import { LeadStatus as LeadStatusEnum } from "@models/lead";
import StatusBadge from "@components/ui/status-badge";
import Pagination from "@components/ui/pagination";
import CreateLeadModal from "@components/leads/create-lead-modal";

interface CurrentParams {
  page?: string;
  status?: string;
  q?: string;
  sort?: string;
  order?: string;
}

interface Props {
  currentParams: CurrentParams;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

function LeadsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Name", "Company", "Status", "Value", "Comments", "Created"].map(
              (header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="mt-1 h-3 w-24 animate-pulse rounded bg-gray-100" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </td>
              <td className="px-6 py-4">
                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-6 animate-pulse rounded bg-gray-200" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LeadsPageContent({ currentParams }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [leadsResponse, setLeadsResponse] = useState<LeadListResponse | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(currentParams.q ?? "");

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(null);

    const queryParams = new URLSearchParams();

    if (currentParams.page) queryParams.set("page", currentParams.page);
    if (currentParams.status) queryParams.set("status", currentParams.status);
    if (currentParams.q) queryParams.set("q", currentParams.q);
    if (currentParams.sort) queryParams.set("sort", currentParams.sort);
    if (currentParams.order) queryParams.set("order", currentParams.order);

    fetch(`${API_URL}/leads?${queryParams.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load leads");

        return response.json() as Promise<LeadListResponse>;
      })
      .then((data) => {
        setLeadsResponse(data);
      })
      .catch((error: unknown) => {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load leads"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentParams.page, currentParams.status, currentParams.q, currentParams.sort, currentParams.order]);

  const updateFilter = (key: string, value: string): void => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    router.push(`/leads?${params.toString()}`);
  };

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    updateFilter("q", searchInput);
  };

  const handleLeadCreated = (): void => {
    setIsCreateModalOpen(false);
    router.refresh();
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, email, company..."
            className="w-64 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200"
          >
            Search
          </button>
          {currentParams.q && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                updateFilter("q", "");
              }}
              className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </form>

        <div className="flex items-center gap-3">
          <select
            value={currentParams.status ?? ""}
            onChange={(event) => updateFilter("status", event.target.value)}
            className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {Object.values(LeadStatusEnum).map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusValue.replace("_", " ")}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Lead
          </button>
        </div>
      </div>

      {isLoading && <LeadsTableSkeleton />}

      {!isLoading && errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{errorMessage}</p>
          <p className="mt-1 text-sm text-red-400">Make sure the backend is running.</p>
        </div>
      )}

      {!isLoading && !errorMessage && leadsResponse && (
        <>
          {leadsResponse.data.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 py-16 text-center">
              <p className="text-lg font-medium text-gray-500">No leads found</p>
              <p className="mt-1 text-sm text-gray-400">
                {currentParams.q || currentParams.status
                  ? "Try adjusting your search or filter"
                  : "Create your first lead to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Company", "Status", "Value", "Comments", "Created"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {leadsResponse.data.map((lead: Lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/leads/${lead.id}`)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          {lead.email && (
                            <p className="text-sm text-gray-500">{lead.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead.company ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead.value != null ? `$${lead.value.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead._count?.comments ?? 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {leadsResponse.data.length} of {leadsResponse.meta.total} leads
            </span>
            <Pagination
              totalPages={leadsResponse.meta.totalPages}
              currentPage={leadsResponse.meta.page}
            />
          </div>
        </>
      )}

      {isCreateModalOpen && (
        <CreateLeadModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleLeadCreated}
        />
      )}
    </div>
  );
}
