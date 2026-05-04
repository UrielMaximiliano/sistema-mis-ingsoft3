import { ArrowDownCircle, ArrowUpCircle, Gauge, WalletCards } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/liquidity";
import type { LiquidityStatus } from "@/lib/liquidity";

export function SummaryCards({ status }: { status: LiquidityStatus }) {
  const cards = [
    {
      icon: WalletCards,
      label: "Balance actual",
      value: formatMoney(status.currentBalance),
    },
    {
      icon: ArrowUpCircle,
      label: "Ingresos proyectados",
      value: formatMoney(status.projectedIncomes),
    },
    {
      icon: ArrowDownCircle,
      label: "Egresos proyectados",
      value: formatMoney(status.projectedExpenses),
    },
    {
      icon: Gauge,
      label: "Costos fijos",
      value: formatMoney(status.fixedCosts),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{card.label}</CardTitle>
              <Icon className="size-5 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="break-words text-2xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
