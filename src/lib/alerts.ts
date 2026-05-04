import type { SupabaseClient } from "@supabase/supabase-js";

import { buildLiquidityAlert } from "@/lib/liquidity";
import type { Database } from "@/lib/supabase/types";
import type { LiquidityStatus } from "@/lib/liquidity";

export async function triggerLiquidityAlert(
  supabase: SupabaseClient<Database>,
  status: LiquidityStatus,
) {
  const alert = buildLiquidityAlert(status);

  if (!alert) {
    return { delivered: false, reason: "healthy" };
  }

  const { data, error } = await supabase.functions.invoke("liquidity-alert", {
    body: alert,
  });

  if (error) {
    throw error;
  }

  return data;
}
