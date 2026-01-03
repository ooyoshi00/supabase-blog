import { redirect } from "next/navigation";
import { createClient } from "../../../../utils/supabase/server";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return children;
};

export default ProtectedLayout;
