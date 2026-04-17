"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Lead, LeadListResponse } from "@models/lead";
import { LeadStatus as LeadStatusEnum } from "@models/lead";
import StatusBadge from "@components/ui/status-badge";
import Pagination from "@components/ui/pagination";
import CreateLeadModal from "@components/leads/create-lead-modal";

interface Props {
  leadsResponse: LeadListResponse;
  currentParams: {
    page?: string;
    status?: string;
    q?: string;
    sort?: string;
    order?: string;
  };
}

export default function LeadsPageContent({
  leadsResponse,
  currentParams,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(currentParams.q ?? "");

  const { data: leads, meta } = leadsResponse;

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

      {leads.length === 0 ? (
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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Comments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {leads.map((lead: Lead) => (
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
                    {lead.value != null
                      ? `$${lead.value.toLocaleString()}`
                      : "—"}
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
          Showing {leads.length} of {meta.total} leads
        </span>
        <Pagination totalPages={meta.totalPages} currentPage={meta.page} />
      </div>

      {isCreateModalOpen && (
        <CreateLeadModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleLeadCreated}
        />
      )}
    </div>
  );
}
