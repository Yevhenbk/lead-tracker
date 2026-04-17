import type { LeadStatus } from "@models/lead";

interface Props {
  status: LeadStatus;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  NEW: { label: "New", className: "bg-sky-100 text-sky-700" },
  CONTACTED: { label: "Contacted", className: "bg-amber-100 text-amber-700" },
  IN_PROGRESS: { label: "In Progress", className: "bg-violet-100 text-violet-700" },
  WON: { label: "Won", className: "bg-emerald-100 text-emerald-700" },
  LOST: { label: "Lost", className: "bg-rose-100 text-rose-600" },
};

export default function StatusBadge({ status }: Props) {
  const { label, className } = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
