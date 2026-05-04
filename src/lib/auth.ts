import type { UserRole } from "@/lib/supabase/types";

export const roleHome: Record<UserRole, string> = {
  admin: "/dashboard",
  operator: "/operator",
  treasury: "/treasury",
};

export function roleCanAccess(role: UserRole, pathname: string) {
  if (pathname.startsWith("/dashboard")) {
    return role === "admin";
  }

  if (pathname.startsWith("/operator")) {
    return role === "operator" || role === "admin";
  }

  if (pathname.startsWith("/treasury")) {
    return role === "treasury" || role === "admin";
  }

  return true;
}
