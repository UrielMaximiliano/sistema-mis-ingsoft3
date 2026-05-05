"use client";

import dynamic from "next/dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonChart } from "@/components/ui/skeleton";
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
          <SkeletonChart height="h-[300px]" />
        </CardContent>
      </Card>
    ),
    ssr: false,
  },
);

export function TrendChart(props: TrendChartProps) {
  return <TrendChartInner {...props} />;
}
