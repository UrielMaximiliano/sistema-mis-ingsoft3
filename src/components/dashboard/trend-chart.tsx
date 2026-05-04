"use client";

import dynamic from "next/dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrendChartProps } from "@/components/dashboard/trend-chart-inner";

const TrendChartInner = dynamic(
  () =>
    import("@/components/dashboard/trend-chart-inner").then(
      (module) => module.TrendChartInner,
    ),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>Tendencia predictiva</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
            Cargando tendencia...
          </div>
        </CardContent>
      </Card>
    ),
    ssr: false,
  },
);

export function TrendChart(props: TrendChartProps) {
  return <TrendChartInner {...props} />;
}
