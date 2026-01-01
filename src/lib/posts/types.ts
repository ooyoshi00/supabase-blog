import type { DraftInput } from "@/lib/drafts/types";

export type PostInput = DraftInput & {
  title: string;
  excerpt: string;
};

export type Post = PostInput & {
  postId: string;
  userId: string;
  publishedAt: string;
  updatedAt: string;
};
