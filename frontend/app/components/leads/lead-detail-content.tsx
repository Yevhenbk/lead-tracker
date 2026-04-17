"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { Lead, LeadStatus } from "@models/lead";
import { LeadStatus as LeadStatusEnum } from "@models/lead";
import type { Comment } from "@models/comment";
import StatusBadge from "@components/ui/status-badge";
import CommentsSection from "@components/comments/comments-section";

interface Props {
  leadId: string;
}

interface EditFormState {
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  value: string;
  notes: string;
}

function DetailSkeleton() {
  return (
    <div>
      <div className="mb-6 h-3.5 w-20 animate-pulse rounded bg-sand-200" />
      <div className="rounded-xl border border-sand-200 bg-white p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded bg-sand-200" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-sand-100" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-14 animate-pulse rounded-lg bg-sand-200" />
            <div className="h-9 w-14 animate-pulse rounded-lg bg-sand-200" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={index === 4 ? "sm:col-span-2" : ""}>
              <div className="h-3 w-14 animate-pulse rounded bg-sand-200" />
              <div className="mt-2 h-5 w-40 animate-pulse rounded bg-sand-100" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-sand-200 bg-white p-6">
        <div className="mb-5 h-5 w-28 animate-pulse rounded bg-sand-200" />
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="mb-3 rounded-lg bg-sand-100 p-4">
            <div className="h-4 w-full animate-pulse rounded bg-sand-200" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-sand-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

const inputClass =
  "mt-1 w-full rounded-lg border border-sand-200 bg-sand-50 px-3 py-2 text-sm text-ink-900 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500";

export default function LeadDetailContent({ leadId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [lead, setLead] = useState<Lead | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    email: "",
    company: "",
    status: LeadStatusEnum.NEW,
    value: "",
    notes: "",
  });

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);

    Promise.all([
      fetch(`${API_URL}/leads/${leadId}`).then((response) => {
        if (!response.ok) throw new Error("Lead not found");

        return response.json() as Promise<Lead>;
      }),
      fetch(`${API_URL}/leads/${leadId}/comments`).then((response) => {
        if (!response.ok) throw new Error("Failed to load comments");

        return response.json() as Promise<Comment[]>;
      }),
    ])
      .then(([leadData, commentsData]) => {
        setLead(leadData);
        setComments(commentsData);
        setEditForm({
          name: leadData.name,
          email: leadData.email ?? "",
          company: leadData.company ?? "",
          status: leadData.status,
          value: leadData.value != null ? String(leadData.value) : "",
          notes: leadData.notes ?? "",
        });
      })
      .catch((error: unknown) => {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load lead"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [leadId]);

  const handleFieldChange = (
    field: keyof EditFormState,
    value: string,
  ): void => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (): Promise<void> => {
    setErrorMessage(null);

    if (!editForm.name.trim()) {
      setErrorMessage("Name is required");
      return;
    }

    setIsSaving(true);

    try {
      const payload: Record<string, unknown> = {
        name: editForm.name.trim(),
        status: editForm.status,
        email: editForm.email.trim() || null,
        company: editForm.company.trim() || null,
        notes: editForm.notes.trim() || null,
        value: editForm.value ? parseFloat(editForm.value) : null,
      };

      const response = await fetch(`${API_URL}/leads/${lead!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          (errorData as { message?: string } | null)?.message ??
            "Failed to update lead",
        );
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (
      !confirm(
        "Are you sure you want to delete this lead? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`${API_URL}/leads/${lead!.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete lead");
      }

      router.push("/leads");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      setIsDeleting(false);
    }
  };

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
        <div className="mb-6 flex items-start justify-between">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(event) =>
                  handleFieldChange("name", event.target.value)
                }
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
                  onClick={() => {
                    setIsEditing(false);
                    setErrorMessage(null);
                  }}
                  className="rounded-lg border border-sand-200 px-3 py-1.5 text-sm text-ink-600 hover:bg-sand-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-lg bg-coffee-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-coffee-600 disabled:opacity-50 transition-colors"
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

        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {errorMessage}
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
              <select value={editForm.status} onChange={(e) => handleFieldChange("status", e.target.value)} className={inputClass}>
                {Object.values(LeadStatusEnum).map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
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
              <textarea value={editForm.notes} onChange={(e) => handleFieldChange("notes", e.target.value)} rows={4} className={inputClass} placeholder="Additional notes…" />
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
