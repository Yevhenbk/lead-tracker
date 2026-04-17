"use client";

import Link from "next/link";

import { LeadStatus as LeadStatusEnum } from "@models/lead";
import { useLead } from "@hooks/use-lead";
import { useLeadMutations } from "@hooks/use-lead-mutations";
import StatusBadge from "@components/ui/status-badge";
import CommentsSection from "@components/comments/comments-section";
import CustomSelect from "@components/ui/custom-select";

interface Props {
  leadId: string;
}

const inputClass =
  "mt-1 w-full rounded-full border border-sand-200 bg-sand-50 px-4 py-2 text-sm text-ink-900 focus:outline-none";

const textareaClass =
  "mt-1 w-full rounded-2xl border border-sand-200 bg-sand-50 px-4 py-2 text-sm text-ink-900 focus:outline-none";

function DetailSkeleton() {
  return (
    <div>
      <div className="mb-6 h-3.5 w-20 animate-pulse rounded bg-sand-200" />
      <div className="rounded-xl border border-sand-200 bg-white p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded bg-sand-200" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-sand-200" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-14 animate-pulse rounded-lg bg-sand-200" />
            <div className="h-8 w-16 animate-pulse rounded-lg bg-sand-200" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="h-3 w-14 animate-pulse rounded bg-sand-200" />
              <div className="mt-1 h-5 w-full animate-pulse rounded bg-sand-200" />
            </div>
          ))}
          <div className="sm:col-span-2">
            <div className="h-3 w-10 animate-pulse rounded bg-sand-200" />
            <div className="mt-1 h-12 w-full animate-pulse rounded bg-sand-200" />
          </div>
        </div>
        <div className="mt-6 border-t border-sand-100 pt-4 flex gap-6">
          <div className="h-3 w-36 animate-pulse rounded bg-sand-200" />
          <div className="h-3 w-36 animate-pulse rounded bg-sand-200" />
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-sand-200 bg-white p-6">
        <div className="mb-5 h-5 w-28 animate-pulse rounded bg-sand-200" />
        <div className="mb-6 h-20 w-full animate-pulse rounded-2xl bg-sand-200" />
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="mb-3 rounded-lg bg-sand-200 p-4">
            <div className="h-4 w-full animate-pulse rounded bg-sand-200" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-sand-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeadDetailContent({ leadId }: Props) {
  const { lead, comments, isLoading, error: fetchError } = useLead(leadId);
  const {
    isEditing,
    setIsEditing,
    editForm,
    handleFieldChange,
    handleSave,
    isSaving,
    handleDelete,
    isDeleting,
    actionError,
    clearActionError,
  } = useLeadMutations(lead);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (fetchError || !lead) {
    return (
      <div>
        <Link href="/leads" className="mb-6 block text-sm text-ink-400 hover:text-ink-600 transition-colors">
          ← Back to Leads
        </Link>
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{fetchError ?? "Lead not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/leads" className="mb-6 block text-sm text-ink-400 hover:text-ink-600 transition-colors">
        ← Back to Leads
      </Link>

      <div className="rounded-xl border border-sand-200 bg-white p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                className="text-xl font-semibold border-b border-sand-200 bg-transparent text-ink-900 focus:border-coffee-500 focus:outline-none pb-0.5"
              />
            ) : (
              <h1 className="text-xl font-semibold text-ink-900">{lead.name}</h1>
            )}
            <div className="mt-2">
              <StatusBadge status={isEditing ? editForm.status : lead.status} />
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => { setIsEditing(false); clearActionError(); }}
                  className="rounded-lg border border-sand-200 px-3 py-1.5 text-sm text-ink-600 hover:bg-sand-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
                >
                  {isSaving ? "Saving…" : "Save"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg border border-sand-200 px-3 py-1.5 text-sm text-ink-600 hover:bg-sand-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-lg border border-red-100 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
              </>
            )}
          </div>
        </div>

        {actionError && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {actionError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-ink-400">Email</p>
            {isEditing ? (
              <input type="email" value={editForm.email} onChange={(e) => handleFieldChange("email", e.target.value)} className={inputClass} placeholder="email@example.com" />
            ) : (
              <p className="mt-1 text-sm text-ink-900">{lead.email ?? "—"}</p>
            )}
          </div>

          <div>
            <p className="text-xs text-ink-400">Company</p>
            {isEditing ? (
              <input type="text" value={editForm.company} onChange={(e) => handleFieldChange("company", e.target.value)} className={inputClass} placeholder="Company name" />
            ) : (
              <p className="mt-1 text-sm text-ink-900">{lead.company ?? "—"}</p>
            )}
          </div>

          <div>
            <p className="text-xs text-ink-400">Status</p>
            {isEditing ? (
              <CustomSelect
                value={editForm.status}
                onChange={(val) => handleFieldChange("status", val)}
                options={Object.values(LeadStatusEnum).map((s) => ({ value: s, label: s.replace("_", " ") }))}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm text-ink-900">{lead.status.replace("_", " ")}</p>
            )}
          </div>

          <div>
            <p className="text-xs text-ink-400">Value</p>
            {isEditing ? (
              <input type="number" min="0" step="0.01" value={editForm.value} onChange={(e) => handleFieldChange("value", e.target.value)} className={inputClass} placeholder="0.00" />
            ) : (
              <p className="mt-1 text-sm text-ink-900">
                {lead.value != null ? `$${lead.value.toLocaleString()}` : "—"}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs text-ink-400">Notes</p>
            {isEditing ? (
              <textarea value={editForm.notes} onChange={(e) => handleFieldChange("notes", e.target.value)} rows={4} className={textareaClass} placeholder="Additional notes…" />
            ) : (
              <p className="mt-1 text-sm text-ink-900 whitespace-pre-wrap">{lead.notes ?? "—"}</p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-sand-100 pt-4 text-xs text-ink-400">
          <span>Created {new Date(lead.createdAt).toLocaleString()}</span>
          <span className="ml-4">Updated {new Date(lead.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-6">
        <CommentsSection leadId={lead.id} initialComments={comments} />
      </div>
    </div>
  );
}
