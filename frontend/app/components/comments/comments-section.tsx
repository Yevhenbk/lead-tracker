"use client";

import { useState } from "react";

import type { Comment } from "@models/comment";
import { useAddComment } from "@hooks/use-add-comment";

interface Props {
  leadId: string;
  initialComments: Comment[];
}

export default function CommentsSection({ leadId, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const { text, setText, submit, isSubmitting, error } = useAddComment(
    leadId,
    (newComment: Comment) => setComments((current) => [newComment, ...current]),
  );

  return (
    <div className="rounded-xl border border-sand-200 bg-white p-6">
      <h2 className="mb-5 text-sm font-semibold text-ink-900">
        Comments{" "}
        <span className="font-normal text-ink-400">({comments.length})</span>
      </h2>

      <form onSubmit={submit} className="mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Add a comment…"
          className="w-full rounded-lg border border-sand-200 bg-sand-50 px-3 py-2 text-sm text-ink-900 placeholder-ink-400 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-ink-400">{text.length}/500</span>
          <div className="flex items-center gap-3">
            {error && <span className="text-xs text-red-500">{error}</span>}
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="rounded-lg bg-coffee-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-coffee-600 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="py-6 text-center text-xs text-ink-400">No comments yet.</p>
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
