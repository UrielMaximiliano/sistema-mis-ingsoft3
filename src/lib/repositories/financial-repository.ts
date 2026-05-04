import {
  categories as demoCategories,
  channels as demoChannels,
  movements as demoMovements,
} from "@/lib/data/demo";
import type { Category, Channel } from "@/lib/data/demo";
import type { CashMovement, MovementType } from "@/lib/liquidity";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type MovementDraft = {
  amount: number;
  categoryId: string;
  channelId: string;
  date: string;
  isProjected: boolean;
  type: MovementType;
};

export type CashflowDataset = {
  categories: Category[];
  channels: Channel[];
  movements: CashMovement[];
};

export interface FinancialRepository {
  getCashflowDataset(): Promise<CashflowDataset>;
}

type MovementQueryRow = {
  amount: number;
  categories: { name: string } | null;
  channels: { name: string } | null;
  date: string;
  id: string;
  is_projected: boolean;
  type: MovementType;
};

export class DemoFinancialRepository implements FinancialRepository {
  async getCashflowDataset(): Promise<CashflowDataset> {
    return {
      categories: demoCategories,
      channels: demoChannels,
      movements: demoMovements,
    };
  }
}

export class SupabaseFinancialRepository implements FinancialRepository {
  async getCashflowDataset(): Promise<CashflowDataset> {
    const supabase = await createClient();

    const [categoryResult, channelResult, movementResult] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("channels").select("*").order("name"),
      supabase
        .from("movements")
        .select("id,date,amount,type,is_projected,categories(name),channels(name)")
        .order("date", { ascending: true }),
    ]);

    const movements = movementResult.error
      ? []
      : ((movementResult.data ?? []) as unknown as MovementQueryRow[]).map(
          (movement) =>
            ({
              amount: Number(movement.amount),
              category: movement.categories?.name ?? "Sin categoria",
              channel: movement.channels?.name ?? "Sin canal",
              date: movement.date,
              id: movement.id,
              isProjected: movement.is_projected,
              type: movement.type,
            }) satisfies CashMovement,
        );

    return {
      categories: (
        categoryResult.error || !categoryResult.data ? demoCategories : categoryResult.data
      ).map((category) => ({
        ...category,
        description: category.description ?? "",
      })),
      channels: channelResult.error || !channelResult.data ? demoChannels : channelResult.data,
      movements,
    };
  }
}

export function createFinancialRepository(): FinancialRepository {
  if (!hasSupabaseEnv()) {
    return new DemoFinancialRepository();
  }

  return new SupabaseFinancialRepository();
}
