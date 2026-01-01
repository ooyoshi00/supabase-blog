import { redirect } from "next/navigation";
import { createClient } from "../../../../../../utils/supabase/server";
import Tiptap from "@/app/blogs/new/Editor";

type DraftEditPageProps = {
  params: {
    id: string;
  };
};

export default async function DraftEditPage({ params }: DraftEditPageProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return <Tiptap draftId={params.id} />;
}
