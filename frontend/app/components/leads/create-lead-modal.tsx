"use client";

import { useState } from "react";

import type { LeadStatus } from "@models/lead";
import { LeadStatus as LeadStatusEnum } from "@models/lead";

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

export default function CreateLeadModal({ onClose, onCreated }: Props) {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFieldChange = (field: keyof FormState, value: string): void => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
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

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

      const response = await fetch(`${apiUrl}/leads`, {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Create New Lead</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {errorMessage && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(event) =>
                  handleFieldChange("name", event.target.value)
                }
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contact name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={(event) =>
                  handleFieldChange("email", event.target.value)
                }
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                value={formState.company}
                onChange={(event) =>
                  handleFieldChange("company", event.target.value)
                }
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formState.status}
                  onChange={(event) =>
                    handleFieldChange("status", event.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(LeadStatusEnum).map((statusValue) => (
                    <option key={statusValue} value={statusValue}>
                      {statusValue.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Value ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.value}
                  onChange={(event) =>
                    handleFieldChange("value", event.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={formState.notes}
                onChange={(event) =>
                  handleFieldChange("notes", event.target.value)
                }
                rows={3}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
