import "server-only";

import type { Comment } from "@models/comment";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export default class CommentsService {
  static async getByLeadId(leadId: string): Promise<Comment[]> {
    const response = await fetch(`${API_URL}/leads/${leadId}/comments`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    return response.json() as Promise<Comment[]>;
  }
}
