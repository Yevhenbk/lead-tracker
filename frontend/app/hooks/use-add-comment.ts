"use client";

import { useState } from "react";

import type { Comment } from "@models/comment";
import { API_URL } from "@lib/api";

interface UseAddCommentResult {
  text: string;
  setText: (value: string) => void;
  submit: (event: { preventDefault(): void }) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function useAddComment(
  leadId: string,
  onAdded: (comment: Comment) => void,
): UseAddCommentResult {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: { preventDefault(): void }): Promise<void> => {
    event.preventDefault();
    setError(null);

    const trimmed = text.trim();

    if (!trimmed) {
      setError("Comment cannot be empty");
      return;
    }

    if (trimmed.length > 500) {
      setError("Comment cannot exceed 500 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/leads/${leadId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          (data as { message?: string } | null)?.message ?? "Failed to add comment",
        );
      }

      const newComment = (await res.json()) as Comment;

      onAdded(newComment);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { text, setText, submit, isSubmitting, error };
}
