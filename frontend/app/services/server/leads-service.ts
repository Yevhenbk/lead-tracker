import "server-only";

import type { Lead, LeadListResponse } from "@models/lead";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export default class LeadsService {
  static async getAll(
    params: Record<string, string>,
  ): Promise<LeadListResponse> {
    const searchParams = new URLSearchParams(params);

    const response = await fetch(
      `${API_URL}/leads?${searchParams.toString()}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leads");
    }

    return response.json() as Promise<LeadListResponse>;
  }

  static async getById(id: string): Promise<Lead> {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Lead not found");
    }

    return response.json() as Promise<Lead>;
  }
}
