import { defaultLiquidityAlertStrategy } from "@/lib/strategies/liquidity-alert-strategy";

export type MovementType = "income" | "expense";
export type LiquidityColor = "green" | "yellow" | "red";
export type AlertLevel = "none" | "risk" | "urgent";

export type CashMovement = {
  id: string;
  date: string;
  amount: number;
  type: MovementType;
  category: string;
  channel: string;
  isProjected: boolean;
};

export type LiquidityStatus = {
  ratio: number;
  currentBalance: number;
  projectedIncomes: number;
  projectedExpenses: number;
  fixedCosts: number;
  color: LiquidityColor;
  label: string;
  alertLevel: AlertLevel;
  message: string;
};

export function calculateLiquidityCoverage(
  movements: CashMovement[],
): LiquidityStatus {
  return defaultLiquidityAlertStrategy.evaluate(movements);
}

export function buildLiquidityAlert(status: LiquidityStatus) {
  if (status.alertLevel === "none") {
    return null;
  }

  return {
    level: status.alertLevel,
    subject:
      status.alertLevel === "urgent"
        ? "Alerta urgente de liquidez"
        : "Alerta de riesgo de liquidez",
    body: [
      status.message,
      `Ratio: ${Number.isFinite(status.ratio) ? status.ratio.toFixed(2) : "N/A"}`,
      `Saldo actual: ${formatMoney(status.currentBalance)}`,
      `Ingresos proyectados: ${formatMoney(status.projectedIncomes)}`,
      `Egresos proyectados: ${formatMoney(status.projectedExpenses)}`,
      `Costos fijos: ${formatMoney(status.fixedCosts)}`,
    ].join("\n"),
  };
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-AR", {
    currency: "ARS",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value);
}
