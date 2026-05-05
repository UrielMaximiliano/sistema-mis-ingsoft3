"use client";

import { useMemo, useState } from "react";

import { ChannelScopeFilter } from "@/components/channel-scope-filter";
import { AlertPanel } from "@/components/dashboard/alert-panel";
import { ComparisonChart } from "@/components/dashboard/comparison-chart";
import { LiquiditySemaphore } from "@/components/dashboard/liquidity-semaphore";
import { ReportActions } from "@/components/dashboard/report-actions";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { VarianceTable } from "@/components/dashboard/variance-table";
import {
  buildComparisonData,
  buildTrendData,
  buildVarianceRows,
} from "@/lib/data/analytics";
import type { Category, Channel } from "@/lib/data/demo";
import { calculateLiquidityCoverage } from "@/lib/liquidity";
import type { CashMovement } from "@/lib/liquidity";
import {
  filterMovementsByScope,
  type ReportScope,
} from "@/lib/reporting";

type DashboardWorkspaceProps = {
  categories: Category[];
  channels: Channel[];
  movements: CashMovement[];
};

export function DashboardWorkspace({
  categories,
  channels,
  movements,
}: DashboardWorkspaceProps) {
  const [scope, setScope] = useState<ReportScope>("Todo");

  const filteredMovements = useMemo(
    () => filterMovementsByScope(movements, scope),
    [movements, scope],
  );
  const status = useMemo(
    () => calculateLiquidityCoverage(filteredMovements),
    [filteredMovements],
  );
  const comparisonData = useMemo(
    () => buildComparisonData(filteredMovements),
    [filteredMovements],
  );
  const trendData = useMemo(() => buildTrendData(filteredMovements), [filteredMovements]);
  const varianceRows = useMemo(
    () => buildVarianceRows(filteredMovements),
    [filteredMovements],
  );

  return (
    <>
      <section
        className="flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-end"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-primary)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <ChannelScopeFilter onChange={setScope} value={scope} />
        <ReportActions
          movements={filteredMovements}
          scope={scope}
          status={status}
          varianceRows={varianceRows}
        />
      </section>
      <LiquiditySemaphore status={status} />
      <SummaryCards status={status} />
      <AlertPanel status={status} />
      <ComparisonChart
        categories={categories.map((category) => category.name)}
        channels={channels.map((channel) => channel.name)}
        data={comparisonData}
      />
      <TrendChart data={trendData} />
      <VarianceTable rows={varianceRows} />
    </>
  );
}
