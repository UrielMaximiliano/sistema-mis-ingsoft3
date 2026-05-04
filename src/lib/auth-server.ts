import { roleHome } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

export async function getCurrentRole(fallback: UserRole): Promise<UserRole> {
  if (!hasSupabaseEnv()) {
    return fallback;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return fallback;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (profile?.role ?? fallback) as UserRole;
}

export function getRoleHome(role: UserRole) {
  return roleHome[role];
}
