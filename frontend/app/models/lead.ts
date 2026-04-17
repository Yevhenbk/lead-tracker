export const LeadStatus = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  IN_PROGRESS: "IN_PROGRESS",
  WON: "WON",
  LOST: "LOST",
} as const;

export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  status: LeadStatus;
  value: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    comments: number;
  };
}

export interface LeadListResponse {
  data: Lead[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
