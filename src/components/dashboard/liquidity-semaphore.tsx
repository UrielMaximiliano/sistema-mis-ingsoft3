import { AlertTriangle, CheckCircle2, Siren } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/liquidity";
import type { LiquidityStatus } from "@/lib/liquidity";
import { cn } from "@/lib/utils";

const statusStyles = {
  green: {
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500 shadow-emerald-200",
    icon: CheckCircle2,
    ring: "ring-emerald-200",
  },
  red: {
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500 shadow-red-200",
    icon: Siren,
    ring: "ring-red-200",
  },
  yellow: {
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-400 shadow-amber-200",
    icon: AlertTriangle,
    ring: "ring-amber-200",
  },
};

export function LiquiditySemaphore({ status }: { status: LiquidityStatus }) {
  const style = statusStyles[status.color];
  const Icon = style.icon;

  return (
    <Card className={cn("overflow-hidden ring-4", style.ring)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Semaforo de liquidez</CardTitle>
            <p className="mt-2 text-sm text-slate-600">{status.message}</p>
          </div>
          <span className={cn("rounded-lg px-3 py-1 text-sm font-semibold", style.badge)}>
            {status.label}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div
            className={cn(
              "flex size-28 shrink-0 items-center justify-center rounded-full shadow-2xl",
              style.dot,
            )}
            aria-label={`Estado ${status.label}`}
            role="img"
          >
            <Icon className="size-12 text-white" />
          </div>
          <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
            <Metric label="Ratio" value={Number.isFinite(status.ratio) ? status.ratio.toFixed(2) : "N/A"} />
            <Metric label="Saldo actual" value={formatMoney(status.currentBalance)} />
            <Metric label="Ingresos proj." value={formatMoney(status.projectedIncomes)} />
            <Metric label="Egresos proj." value={formatMoney(status.projectedExpenses)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}
