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

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
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
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        Comments ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newCommentText}
          onChange={(event) => setNewCommentText(event.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Add a comment..."
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {newCommentText.length}/500
          </span>
          <div className="flex items-center gap-2">
            {errorMessage && (
              <span className="text-sm text-red-600">{errorMessage}</span>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !newCommentText.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </form>

      {comments.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          <p>No comments yet. Be the first to add one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-800">{comment.text}</p>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
