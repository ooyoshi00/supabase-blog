import { NextResponse } from "next/server";
import { createClient } from "../../../../../../utils/supabase/server";
import { createPost } from "@/lib/posts/repository";
import { deleteDraft } from "@/lib/drafts/repository";
import { isValidDraftInput } from "@/lib/drafts/validation";
import { buildDraftPreview } from "@/lib/drafts/service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ draftId: string }> }
) {
  const { draftId } = await params;
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
    return NextResponse.json({ error: "Invalid post payload" }, { status: 400 });
  }

  const preview = buildDraftPreview(payload.content);

  try {
    const post = await createPost(data.user.id, {
      content: payload.content,
      imageRefs: payload.imageRefs,
      title: preview.title,
      excerpt: preview.excerpt,
    });
    await deleteDraft(data.user.id, draftId);
    return NextResponse.json(post, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Publish failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
