import { createClient } from "../../../utils/supabase/server";
import type { Draft, DraftInput, ImageRef } from "./types";

type DraftRow = {
  id: string;
  user_id: string;
  content: Record<string, unknown>;
  image_refs: ImageRef[];
  updated_at: string;
};

const DRAFTS_TABLE = "drafts";

function mapDraft(row: DraftRow): Draft {
  return {
    draftId: row.id,
    userId: row.user_id,
    content: row.content,
    imageRefs: Array.isArray(row.image_refs) ? row.image_refs : [],
    updatedAt: row.updated_at,
  };
}

export async function fetchDraftById(userId: string, draftId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(DRAFTS_TABLE)
    .select("id, user_id, content, image_refs, updated_at")
    .eq("user_id", userId)
    .eq("id", draftId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapDraft(data as DraftRow);
}

export async function fetchDraftsByUserId(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(DRAFTS_TABLE)
    .select("id, user_id, content, image_refs, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapDraft(row as DraftRow));
}

export async function createDraft(userId: string, input: DraftInput) {
  const supabase = await createClient();
  const payload = {
    user_id: userId,
    content: input.content,
    image_refs: input.imageRefs,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from(DRAFTS_TABLE)
    .insert(payload)
    .select("id, user_id, content, image_refs, updated_at")
    .single();

  if (error) {
    throw error;
  }

  return mapDraft(data as DraftRow);
}

export async function updateDraft(
  userId: string,
  draftId: string,
  input: DraftInput,
) {
  const supabase = await createClient();
  const payload = {
    content: input.content,
    image_refs: input.imageRefs,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from(DRAFTS_TABLE)
    .update(payload)
    .eq("user_id", userId)
    .eq("id", draftId)
    .select("id, user_id, content, image_refs, updated_at")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapDraft(data as DraftRow);
}
