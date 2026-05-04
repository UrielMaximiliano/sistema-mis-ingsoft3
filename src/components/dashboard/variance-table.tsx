import { TriangleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, formatPercent } from "@/lib/liquidity";
import { cn } from "@/lib/utils";

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
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-3 pr-4">Categoria</th>
                <th className="py-3 pr-4">Canal</th>
                <th className="py-3 pr-4">Proyectado</th>
                <th className="py-3 pr-4">Real</th>
                <th className="py-3 pr-4">Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isHighVariance = Math.abs(row.variance) > 0.15;

                return (
                  <tr className="border-b border-slate-100" key={row.key}>
                    <td className="py-3 pr-4 font-medium text-slate-900">{row.category}</td>
                    <td className="py-3 pr-4 text-slate-600">{row.channel}</td>
                    <td className="py-3 pr-4 text-slate-700">{formatMoney(row.projected)}</td>
                    <td className="py-3 pr-4 text-slate-700">{formatMoney(row.real)}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg px-2.5 py-1 font-semibold",
                          isHighVariance
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700",
                        )}
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
