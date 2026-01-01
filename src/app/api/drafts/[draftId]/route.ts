import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
import { fetchDraftById, updateDraft } from "@/lib/drafts/repository";
import { isValidDraftInput } from "@/lib/drafts/validation";

type RouteParams = {
  params: {
    draftId: string;
  };
};

export async function GET(_: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const draft = await fetchDraftById(data.user.id, params.draftId);

  if (!draft) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(draft, { status: 200 });
}

export async function PATCH(request: Request, { params }: RouteParams) {
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
    const draft = await updateDraft(data.user.id, params.draftId, payload);
    if (!draft) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.json(draft, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
