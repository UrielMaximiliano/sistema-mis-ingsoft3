"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/browser";

export function RealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      return;
    }

    const supabase = createClient();
    const channel = supabase
      .channel("cashflow-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "movements" },
        () => router.refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "period_locks" },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
