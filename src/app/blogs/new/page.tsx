import { redirect } from "next/navigation";
import { createClient } from "../../../../utils/supabase/server";
import Tiptap from "./Editor";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return <Tiptap />;
}
