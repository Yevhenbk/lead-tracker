"use client";

import { useState } from "react";

import type { LeadStatus } from "@models/lead";
import { LeadStatus as LeadStatusEnum } from "@models/lead";
import { API_URL } from "@lib/api";
import CustomSelect from "@components/ui/custom-select";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

interface FormState {
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  value: string;
  notes: string;
}

const INITIAL_FORM_STATE: FormState = {
  name: "",
  email: "",
  company: "",
  status: LeadStatusEnum.NEW,
  value: "",
  notes: "",
};

const inputClass =
  "w-full rounded-full border border-sand-200 bg-sand-50 px-4 py-2 text-sm text-ink-900 placeholder-ink-400 focus:outline-none";

const textareaClass =
  "w-full rounded-2xl border border-sand-200 bg-sand-50 px-4 py-2 text-sm text-ink-900 placeholder-ink-400 focus:outline-none";

export default function CreateLeadModal({ onClose, onCreated }: Props) {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFieldChange = (field: keyof FormState, value: string): void => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: { preventDefault(): void }): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    if (!formState.name.trim()) {
      setErrorMessage("Name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        name: formState.name.trim(),
        status: formState.status,
      };

      if (formState.email.trim()) payload.email = formState.email.trim();
      if (formState.company.trim()) payload.company = formState.company.trim();
      if (formState.notes.trim()) payload.notes = formState.notes.trim();
      if (formState.value) payload.value = parseFloat(formState.value);

      const response = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          (errorData as { message?: string } | null)?.message ??
            "Failed to create lead",
        );
      }

      onCreated();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="border-b border-sand-100 px-6 py-4">
          <h2 className="text-base font-semibold text-ink-900">New Lead</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          {errorMessage && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-ink-400">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                className={inputClass}
                placeholder="Contact name"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-ink-400">Email</label>
              <input
                type="email"
                value={formState.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
                className={inputClass}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-ink-400">Company</label>
              <input
                type="text"
                value={formState.company}
                onChange={(event) => handleFieldChange("company", event.target.value)}
                className={inputClass}
                placeholder="Company name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-ink-400">Status</label>
                <CustomSelect
                  value={formState.status}
                  onChange={(val) => handleFieldChange("status", val)}
                  options={Object.values(LeadStatusEnum).map((s) => ({ value: s, label: s.replace("_", " ") }))}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-ink-400">Value ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.value}
                  onChange={(event) => handleFieldChange("value", event.target.value)}
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-ink-400">Notes</label>
              <textarea
                value={formState.notes}
                onChange={(event) => handleFieldChange("notes", event.target.value)}
                rows={3}
                className={textareaClass}
                placeholder="Additional notes…"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-sand-200 px-4 py-2 text-sm text-ink-600 hover:bg-sand-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Creating…" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
