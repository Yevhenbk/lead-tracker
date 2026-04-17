"use client";

import { useState } from "react";

import type { Comment } from "@models/comment";

interface Props {
  leadId: string;
  initialComments: Comment[];
}

export default function CommentsSection({ leadId, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

  const handleSubmit = async (event: { preventDefault(): void }): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    const trimmedText = newCommentText.trim();

    if (!trimmedText) {
      setErrorMessage("Comment cannot be empty");
      return;
    }

    if (trimmedText.length > 500) {
      setErrorMessage("Comment cannot exceed 500 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/leads/${leadId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmedText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          (errorData as { message?: string } | null)?.message ??
            "Failed to add comment",
        );
      }

      const newComment = (await response.json()) as Comment;

      setComments((current) => [newComment, ...current]);
      setNewCommentText("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-sand-200 bg-white p-6">
      <h2 className="mb-5 text-sm font-semibold text-ink-900">
        Comments{" "}
        <span className="font-normal text-ink-400">({comments.length})</span>
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newCommentText}
          onChange={(event) => setNewCommentText(event.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Add a comment…"
          className="w-full rounded-lg border border-sand-200 bg-sand-50 px-3 py-2 text-sm text-ink-900 placeholder-ink-400 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-ink-400">{newCommentText.length}/500</span>
          <div className="flex items-center gap-3">
            {errorMessage && (
              <span className="text-xs text-red-500">{errorMessage}</span>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !newCommentText.trim()}
              className="rounded-lg bg-coffee-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-coffee-600 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="py-6 text-center text-xs text-ink-400">
          No comments yet.
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg bg-sand-50 p-4">
              <p className="text-sm text-ink-900">{comment.text}</p>
              <p className="mt-2 text-xs text-ink-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
