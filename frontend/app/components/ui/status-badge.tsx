import type { LeadStatus } from "@models/lead";

interface Props {
  status: LeadStatus;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  NEW: { label: "New", className: "bg-blue-100 text-blue-800" },
  CONTACTED: { label: "Contacted", className: "bg-yellow-100 text-yellow-800" },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-purple-100 text-purple-800",
  },
  WON: { label: "Won", className: "bg-green-100 text-green-800" },
  LOST: { label: "Lost", className: "bg-red-100 text-red-800" },
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
