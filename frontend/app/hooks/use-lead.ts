"use client";

import { useEffect, useState } from "react";

import type { Lead } from "@models/lead";
import type { Comment } from "@models/comment";
import { API_URL } from "@lib/api";

interface UseLeadResult {
  lead: Lead | null;
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
}

export function useLead(leadId: string): UseLeadResult {
  const [lead, setLead] = useState<Lead | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetch(`${API_URL}/leads/${leadId}`).then((res) => {
        if (!res.ok) throw new Error("Lead not found");
        return res.json() as Promise<Lead>;
      }),
      fetch(`${API_URL}/leads/${leadId}/comments`).then((res) => {
        if (!res.ok) throw new Error("Failed to load comments");
        return res.json() as Promise<Comment[]>;
      }),
    ])
      .then(([leadData, commentsData]) => {
        setLead(leadData);
        setComments(commentsData);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load lead");
      })
      .finally(() => setIsLoading(false));
  }, [leadId]);

  return { lead, comments, isLoading, error };
}
