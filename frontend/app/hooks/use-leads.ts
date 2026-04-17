"use client";

import { useEffect, useState } from "react";

import type { LeadListResponse } from "@models/lead";
import { API_URL } from "@lib/api";

export interface LeadQueryParams {
  page?: string;
  status?: string;
  q?: string;
  sort?: string;
  order?: string;
}

interface UseLeadsResult {
  leadsResponse: LeadListResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useLeads(params: LeadQueryParams): UseLeadsResult {
  const [leadsResponse, setLeadsResponse] = useState<LeadListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();

    if (params.page) query.set("page", params.page);
    if (params.status) query.set("status", params.status);
    if (params.q) query.set("q", params.q);
    if (params.sort) query.set("sort", params.sort);
    if (params.order) query.set("order", params.order);

    fetch(`${API_URL}/leads?${query.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load leads");
        return res.json() as Promise<LeadListResponse>;
      })
      .then(setLeadsResponse)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load leads");
      })
      .finally(() => setIsLoading(false));
  }, [params.page, params.status, params.q, params.sort, params.order]);

  return { leadsResponse, isLoading, error };
}
