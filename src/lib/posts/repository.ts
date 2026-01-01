import { createClient } from "../../../utils/supabase/server";
import type { Post, PostInput } from "./types";
import type { ImageRef } from "@/lib/drafts/types";

type PostRow = {
  id: string;
  user_id: string;
  title: string;
  excerpt: string;
  content: Record<string, unknown>;
  image_refs: ImageRef[];
  published_at: string;
  updated_at: string;
};

const POSTS_TABLE = "posts";

const mapPost = (row: PostRow): Post => ({
  postId: row.id,
  userId: row.user_id,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  imageRefs: Array.isArray(row.image_refs) ? row.image_refs : [],
  publishedAt: row.published_at,
  updatedAt: row.updated_at,
});

export async function createPost(userId: string, input: PostInput) {
  const supabase = await createClient();
  const payload = {
    user_id: userId,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    image_refs: input.imageRefs,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from(POSTS_TABLE)
    .insert(payload)
    .select("id, user_id, title, excerpt, content, image_refs, published_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  return mapPost(data as PostRow);
}

export async function fetchPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(POSTS_TABLE)
    .select("id, user_id, title, excerpt, content, image_refs, published_at, updated_at")
    .order("published_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapPost(row as PostRow));
}

export async function fetchPostById(postId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(POSTS_TABLE)
    .select("id, user_id, title, excerpt, content, image_refs, published_at, updated_at")
    .eq("id", postId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapPost(data as PostRow);
}
