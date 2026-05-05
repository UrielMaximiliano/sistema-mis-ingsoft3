"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { formatMoney } from "@/lib/liquidity";

type ComparisonDatum = {
  category: string;
  channel: string;
  name: string;
  projected: number;
  real: number;
};

export type ComparisonChartProps = {
  categories: string[];
  channels: string[];
  data: ComparisonDatum[];
};

export function ComparisonChartInner({
  categories,
  channels,
  data,
}: ComparisonChartProps) {
  const [category, setCategory] = useState("all");
  const [channel, setChannel] = useState("all");

  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        const matchesCategory = category === "all" || item.category === category;
        const matchesChannel = channel === "all" || item.channel === channel;

        return matchesCategory && matchesChannel;
      }),
    [category, channel, data],
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Proyectado vs real</CardTitle>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              Comparacion por categoria y canal comercial.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:w-[420px]">
            <Select
              aria-label="Filtrar por categoria"
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              <option value="all">Todas las categorias</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Filtrar por canal"
              onChange={(event) => setChannel(event.target.value)}
              value={channel}
            >
              <option value="all">Todos los canales</option>
              {channels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[360px] w-full">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              data={filteredData}
              margin={{ bottom: 24, left: 12, right: 12, top: 12 }}
            >
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="name"
                interval={0}
                stroke="var(--chart-axis)"
                tick={{ fontSize: 11 }}
                tickLine={false}
              />
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
              <Bar
                dataKey="projected"
                fill="var(--chart-projected)"
                name="Proyectado"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="real" fill="var(--chart-real)" name="Real" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
