import { TriangleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, formatPercent } from "@/lib/liquidity";

type VarianceRow = {
  category: string;
  channel: string;
  key: string;
  projected: number;
  real: number;
  variance: number;
};

export function VarianceTable({ rows }: { rows: VarianceRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisis de desviaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr
                className="border-b text-xs uppercase"
                style={{ borderColor: "var(--border-primary)", color: "var(--text-tertiary)" }}
              >
                <th className="py-3 pr-4">Categoria</th>
                <th className="py-3 pr-4">Canal</th>
                <th className="py-3 pr-4">Proyectado</th>
                <th className="py-3 pr-4">Real</th>
                <th className="py-3 pr-4">Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isHighVariance = Math.abs(row.variance) > 0.15;

                return (
                  <tr
                    className="border-b transition-colors"
                    key={row.key}
                    style={{
                      borderColor: "var(--border-secondary)",
                      background: i % 2 === 1 ? "var(--bg-surface-alt)" : "transparent",
                    }}
                  >
                    <td className="py-3 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>
                      {row.category}
                    </td>
                    <td className="py-3 pr-4" style={{ color: "var(--text-secondary)" }}>
                      {row.channel}
                    </td>
                    <td className="py-3 pr-4 font-mono" style={{ color: "var(--text-secondary)" }}>
                      {formatMoney(row.projected)}
                    </td>
                    <td className="py-3 pr-4 font-mono" style={{ color: "var(--text-secondary)" }}>
                      {formatMoney(row.real)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1 font-semibold font-mono"
                        style={{
                          background: isHighVariance ? "var(--accent-red-soft)" : "var(--bg-inset)",
                          color: isHighVariance ? "var(--accent-red)" : "var(--text-secondary)",
                          boxShadow: isHighVariance ? `0 0 8px var(--glow-red)` : "none",
                        }}
                      >
                        {isHighVariance ? <TriangleAlert className="size-4" /> : null}
                        {formatPercent(row.variance)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
