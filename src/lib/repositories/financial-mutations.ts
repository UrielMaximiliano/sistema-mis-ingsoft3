"use client";

import type { MovementDraft } from "@/lib/repositories/financial-repository";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/browser";

export async function createMovement(draft: MovementDraft) {
  if (!hasSupabaseEnv()) {
    return { demo: true };
  }

  const supabase = createClient();
  const { error } = await supabase.from("movements").insert({
    amount: draft.amount,
    category_id: draft.categoryId,
    channel_id: draft.channelId,
    date: draft.date,
    is_projected: draft.isProjected,
    type: draft.type,
  });

  if (error) {
    throw error;
  }

  return { demo: false };
}

export async function lockWeek(weekStart: string) {
  if (!hasSupabaseEnv()) {
    return { demo: true };
  }

  const supabase = createClient();
  const { error } = await supabase.from("period_locks").insert({
    reason: "Reconciliacion semanal aprobada",
    week_start: weekStart,
  });

  if (error) {
    throw error;
  }

  return { demo: false };
}
