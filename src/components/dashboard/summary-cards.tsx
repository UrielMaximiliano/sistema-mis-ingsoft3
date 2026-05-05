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
      accent: "var(--accent-amber)",
    },
    {
      icon: ArrowUpCircle,
      label: "Ingresos proyectados",
      value: formatMoney(status.projectedIncomes),
      accent: "var(--accent-emerald)",
    },
    {
      icon: ArrowDownCircle,
      label: "Egresos proyectados",
      value: formatMoney(status.projectedExpenses),
      accent: "var(--accent-red)",
    },
    {
      icon: Gauge,
      label: "Costos fijos",
      value: formatMoney(status.fixedCosts),
      accent: "var(--accent-cyan)",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.label}
            className="animate-card-enter"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{card.label}</CardTitle>
              <Icon className="size-5" style={{ color: card.accent }} />
            </CardHeader>
            <CardContent>
              <p className="break-words text-2xl font-semibold font-mono" style={{ color: "var(--text-primary)" }}>
                {card.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
