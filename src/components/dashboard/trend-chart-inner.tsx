"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/liquidity";

export type TrendChartProps = {
  data: Array<{
    date: string;
    projected: number;
    real: number;
  }>;
};

export function TrendChartInner({ data }: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia predictiva</CardTitle>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Evolucion acumulada para anticipar faltantes de caja a 15 dias.
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={data} margin={{ bottom: 10, left: 12, right: 12, top: 12 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--chart-axis)" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis
                stroke="var(--chart-axis)"
                tickFormatter={(value) => `$${Number(value) / 1000000}M`}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => formatMoney(Number(value))}
                contentStyle={{
                  background: "var(--bg-elevated)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Line
                dataKey="projected"
                dot={false}
                name="Proyectado acumulado"
                stroke="var(--chart-projected)"
                strokeWidth={3}
                type="monotone"
              />
              <Line
                dataKey="real"
                dot={false}
                name="Real acumulado"
                stroke="var(--chart-real)"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
