"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Lead, LeadStatus } from "@models/lead";
import { LeadStatus as LeadStatusEnum } from "@models/lead";
import { API_URL } from "@lib/api";

export interface LeadEditForm {
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  value: string;
  notes: string;
}

interface UseLeadMutationsResult {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  editForm: LeadEditForm;
  handleFieldChange: (field: keyof LeadEditForm, value: string) => void;
  handleSave: () => Promise<void>;
  isSaving: boolean;
  handleDelete: () => Promise<void>;
  isDeleting: boolean;
  actionError: string | null;
  clearActionError: () => void;
}

const EMPTY_FORM: LeadEditForm = {
  name: "",
  email: "",
  company: "",
  status: LeadStatusEnum.NEW,
  value: "",
  notes: "",
};

export function useLeadMutations(lead: Lead | null): UseLeadMutationsResult {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<LeadEditForm>(EMPTY_FORM);

  useEffect(() => {
    if (!lead) return;
    setEditForm({
      name: lead.name,
      email: lead.email ?? "",
      company: lead.company ?? "",
      status: lead.status,
      value: lead.value != null ? String(lead.value) : "",
      notes: lead.notes ?? "",
    });
  }, [lead]);

  const handleFieldChange = (field: keyof LeadEditForm, value: string): void => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (): Promise<void> => {
    if (!lead) return;
    setActionError(null);

    if (!editForm.name.trim()) {
      setActionError("Name is required");
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

      const res = await fetch(`${API_URL}/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          (data as { message?: string } | null)?.message ?? "Failed to update lead",
        );
      }

      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!lead) return;
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`${API_URL}/leads/${lead.id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete lead");

      router.push("/leads");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      setIsDeleting(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    editForm,
    handleFieldChange,
    handleSave,
    isSaving,
    handleDelete,
    isDeleting,
    actionError,
    clearActionError: () => setActionError(null),
  };
}
