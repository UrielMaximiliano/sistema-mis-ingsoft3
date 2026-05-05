"use client";

import dynamic from "next/dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonChart } from "@/components/ui/skeleton";
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
          <SkeletonChart />
        </CardContent>
      </Card>
    ),
    ssr: false,
  },
);

export function ComparisonChart(props: ComparisonChartProps) {
  return <ComparisonChartInner {...props} />;
}
