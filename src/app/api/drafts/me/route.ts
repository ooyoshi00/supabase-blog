import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
import { fetchDraftByUserId, upsertDraft } from "@/lib/drafts/repository";
import type { DraftInput } from "@/lib/drafts/types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isValidDraftInput = (value: unknown): value is DraftInput => {
  if (!isRecord(value)) {
    return false;
  }

  if (!isRecord(value.content)) {
    return false;
  }

  if (!Array.isArray(value.imageRefs)) {
    return false;
  }

  return value.imageRefs.every((ref) => {
    if (!isRecord(ref)) {
      return false;
    }

    return (
      typeof ref.assetId === "string" &&
      typeof ref.storageRef === "string" &&
      typeof ref.order === "number"
    );
  });
};

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const draft = await fetchDraftByUserId(data.user.id);

  if (!draft) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(draft, { status: 200 });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidDraftInput(payload)) {
    return NextResponse.json({ error: "Invalid draft payload" }, { status: 400 });
  }

  try {
    const draft = await upsertDraft(data.user.id, payload);
    return NextResponse.json(draft, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
