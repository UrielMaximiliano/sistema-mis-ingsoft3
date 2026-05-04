"use client";

import dynamic from "next/dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComparisonChartProps } from "@/components/dashboard/comparison-chart-inner";

const ComparisonChartInner = dynamic(
  () =>
    import("@/components/dashboard/comparison-chart-inner").then(
      (module) => module.ComparisonChartInner,
    ),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>Proyectado vs real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[360px] items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
            Cargando grafico...
          </div>
        </CardContent>
      </Card>
    ),
    ssr: false,
  },
);

export function ComparisonChart(props: ComparisonChartProps) {
  return <ComparisonChartInner {...props} />;
}
