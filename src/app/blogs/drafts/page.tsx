import { redirect } from "next/navigation";
import { createClient } from "../../../../utils/supabase/server";
import { fetchDraftsByUserId } from "@/lib/drafts/repository";
import DraftList from "./DraftList";

export default async function DraftsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const drafts = await fetchDraftsByUserId(data.user.id);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <DraftList drafts={drafts} />
    </div>
  );
}
