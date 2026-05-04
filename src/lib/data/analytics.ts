import type { CashMovement } from "@/lib/liquidity";

export type VarianceRow = {
  key: string;
  category: string;
  channel: string;
  projected: number;
  real: number;
  variance: number;
};

export function buildVarianceRows(movements: CashMovement[]) {
  const grouped = new Map<string, VarianceRow>();

  for (const movement of movements) {
    const key = `${movement.category}:${movement.channel}`;
    const current = grouped.get(key) ?? {
      category: movement.category,
      channel: movement.channel,
      key,
      projected: 0,
      real: 0,
      variance: 0,
    };

    if (movement.isProjected) {
      current.projected += movement.amount;
    } else {
      current.real += movement.amount;
    }

    grouped.set(key, current);
  }

  return Array.from(grouped.values()).map((row) => ({
    ...row,
    variance: row.projected === 0 ? 0 : (row.real - row.projected) / row.projected,
  }));
}

export function buildComparisonData(movements: CashMovement[]) {
  const rows = buildVarianceRows(movements);

  return rows.map((row) => ({
    category: row.category,
    channel: row.channel,
    name: `${row.category} / ${row.channel}`,
    projected: row.projected,
    real: row.real,
  }));
}

export function buildTrendData(movements: CashMovement[], days = 15) {
  const today = new Date("2026-05-04T00:00:00");
  const rows = new Map<
    string,
    {
      date: string;
      projectedNet: number;
      realNet: number;
    }
  >();

  for (let index = 0; index < days; index += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    rows.set(key, { date: key.slice(5), projectedNet: 0, realNet: 0 });
  }

  for (const movement of movements) {
    const key = movement.date;
    const row = rows.get(key);

    if (!row) {
      continue;
    }

    const signedAmount = movement.type === "income" ? movement.amount : -movement.amount;

    if (movement.isProjected) {
      row.projectedNet += signedAmount;
    } else {
      row.realNet += signedAmount;
    }
  }

  let projectedCumulative = 0;
  let realCumulative = 0;

  return Array.from(rows.values()).map((row) => {
    projectedCumulative += row.projectedNet;
    realCumulative += row.realNet;

    return {
      date: row.date,
      projected: projectedCumulative,
      real: realCumulative,
    };
  });
}
