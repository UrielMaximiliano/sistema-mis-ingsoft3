import { AlertTriangle, CheckCircle2, Siren } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/liquidity";
import type { LiquidityStatus } from "@/lib/liquidity";

const statusConfig = {
  green: {
    glow: "var(--glow-green)",
    color: "var(--accent-emerald)",
    softBg: "var(--accent-emerald-soft)",
    icon: CheckCircle2,
  },
  red: {
    glow: "var(--glow-red)",
    color: "var(--accent-red)",
    softBg: "var(--accent-red-soft)",
    icon: Siren,
  },
  yellow: {
    glow: "var(--glow-amber)",
    color: "var(--accent-amber)",
    softBg: "var(--accent-amber-soft)",
    icon: AlertTriangle,
  },
};

export function LiquiditySemaphore({ status }: { status: LiquidityStatus }) {
  const config = statusConfig[status.color];
  const Icon = config.icon;

  return (
    <Card
      style={{
        boxShadow: `var(--shadow-card), 0 0 0 4px ${config.glow}`,
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Semaforo de liquidez</CardTitle>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              {status.message}
            </p>
          </div>
          <span
            className="rounded-lg px-3 py-1 text-sm font-semibold"
            style={{ background: config.softBg, color: config.color }}
          >
            {status.label}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative flex size-28 shrink-0 items-center justify-center">
            {/* Glow pulse ring */}
            <div
              className="absolute inset-0 rounded-full animate-glow-pulse"
              style={{ background: config.color, opacity: 0.15 }}
            />
            {/* Solid circle */}
            <div
              className="relative flex size-28 items-center justify-center rounded-full shadow-2xl"
              style={{ background: config.color }}
              aria-label={`Estado ${status.label}`}
              role="img"
            >
              <Icon className="size-12 text-white" />
            </div>
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
    <div
      className="rounded-lg border p-3"
      style={{
        background: "var(--bg-inset)",
        borderColor: "var(--border-secondary)",
      }}
    >
      <p className="text-xs font-medium uppercase" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </p>
      <p className="mt-1 break-words text-lg font-semibold font-mono" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
    </div>
  );
}
