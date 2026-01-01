import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";
import { createDraft, fetchDraftsByUserId } from "@/lib/drafts/repository";
import { isValidDraftInput } from "@/lib/drafts/validation";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const drafts = await fetchDraftsByUserId(data.user.id);
    return NextResponse.json(drafts, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Load failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
    const draft = await createDraft(data.user.id, payload);
    return NextResponse.json(draft, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
