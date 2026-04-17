"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Lead } from "@models/lead";
import { LeadStatus as LeadStatusEnum } from "@models/lead";
import { useLeads } from "@hooks/use-leads";
import StatusBadge from "@components/ui/status-badge";
import Pagination from "@components/ui/pagination";
import CreateLeadModal from "@components/leads/create-lead-modal";
import CustomSelect from "@components/ui/custom-select";

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

function LeadsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-sand-200 bg-white">
      <table className="min-w-full divide-y divide-sand-200">
        <thead className="bg-sand-100">
          <tr>
            {["Name", "Company", "Status", "Value", "Comments", "Created"].map(
              (header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-ink-400"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-sand-100 bg-white">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4">
                <div className="h-4 w-32 animate-pulse rounded bg-sand-200" />
                <div className="mt-1.5 h-3 w-24 animate-pulse rounded bg-sand-100" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-24 animate-pulse rounded bg-sand-200" />
              </td>
              <td className="px-6 py-4">
                <div className="h-5 w-16 animate-pulse rounded-full bg-sand-200" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-16 animate-pulse rounded bg-sand-200" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-6 animate-pulse rounded bg-sand-200" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-20 animate-pulse rounded bg-sand-200" />
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(currentParams.q ?? "");

  const { leadsResponse, isLoading, error } = useLeads(currentParams);

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

  const handleSearchSubmit = (event: { preventDefault(): void }): void => {
    event.preventDefault();
    updateFilter("q", searchInput);
  };

  const handleLeadCreated = (): void => {
    setIsCreateModalOpen(false);
    router.refresh();
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, email, company..."
            className="w-64 rounded-full border border-sand-200 bg-white px-4 py-2 text-sm text-ink-900 placeholder-ink-400 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full border border-sand-200 bg-white px-4 py-2 text-sm text-ink-600 hover:bg-sand-100 transition-colors"
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
              className="px-3 py-2 text-sm text-ink-400 hover:text-ink-600 transition-colors"
            >
              Clear
            </button>
          )}
        </form>

        <div className="flex items-center gap-3">
          <CustomSelect
            value={currentParams.status ?? ""}
            onChange={(val) => updateFilter("status", val)}
            options={[
              { value: "", label: "All Statuses" },
              ...Object.values(LeadStatusEnum).map((s) => ({ value: s, label: s.replace("_", " ") })),
            ]}
          />

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            New Lead
          </button>
        </div>
      </div>

      {isLoading && <LeadsTableSkeleton />}

      {!isLoading && error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <p className="mt-1 text-xs text-red-400">Make sure the backend is running.</p>
        </div>
      )}

      {!isLoading && !error && leadsResponse && (
        <>
          {leadsResponse.data.length === 0 ? (
            <div className="rounded-xl border border-dashed border-sand-200 py-16 text-center">
              <p className="text-sm font-medium text-ink-600">No leads found</p>
              <p className="mt-1 text-xs text-ink-400">
                {currentParams.q || currentParams.status
                  ? "Try adjusting your search or filter"
                  : "Create your first lead to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-sand-200 bg-white">
              <table className="min-w-full divide-y divide-sand-200">
                <thead className="bg-sand-100">
                  <tr>
                    {["Name", "Company", "Status", "Value", "Comments", "Created"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-ink-400"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100 bg-white">
                  {leadsResponse.data.map((lead: Lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/leads/${lead.id}`)}
                      className="cursor-pointer transition-colors hover:bg-sand-50"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-ink-900">{lead.name}</p>
                        {lead.email && (
                          <p className="mt-0.5 text-xs text-ink-400">{lead.email}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-600">
                        {lead.company ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-600">
                        {lead.value != null ? `$${lead.value.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-400">
                        {lead._count?.comments ?? 0}
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
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
