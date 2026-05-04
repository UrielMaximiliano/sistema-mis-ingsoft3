import { NextResponse, type NextRequest } from "next/server";

import { roleCanAccess, roleHome } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createProxyClient } from "@/lib/supabase/proxy";
import type { UserRole } from "@/lib/supabase/types";

const protectedPaths = ["/dashboard", "/operator", "/treasury"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (!hasSupabaseEnv()) {
    return NextResponse.next();
  }

  const { response, supabase } = createProxyClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!user) {
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile?.role ?? "operator") as UserRole;

  if (pathname === "/login") {
    return NextResponse.redirect(new URL(roleHome[role], request.url));
  }

  if (isProtectedPath && !roleCanAccess(role, pathname)) {
    return NextResponse.redirect(new URL(roleHome[role], request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/operator/:path*", "/treasury/:path*", "/login"],
};
