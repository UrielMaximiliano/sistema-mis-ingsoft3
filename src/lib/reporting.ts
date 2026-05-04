import type { VarianceRow } from "@/lib/data/analytics";
import type { CashMovement, LiquidityStatus } from "@/lib/liquidity";

export type ReportScope = "Todo" | "Mayorista" | "Minorista";

export function filterMovementsByScope(
  movements: CashMovement[],
  scope: ReportScope,
) {
  if (scope === "Todo") {
    return movements;
  }

  return movements.filter((movement) => movement.channel === scope);
}

export function toMovementReportRows(movements: CashMovement[]) {
  return movements.map((movement) => ({
    Canal: movement.channel,
    Categoria: movement.category,
    Estado: movement.isProjected ? "Proyectado" : "Real",
    Fecha: movement.date,
    Importe: movement.amount,
    Tipo: movement.type === "income" ? "Ingreso" : "Egreso",
  }));
}

export function toVarianceReportRows(rows: VarianceRow[]) {
  return rows.map((row) => ({
    Canal: row.channel,
    Categoria: row.category,
    Diferencia: `${(row.variance * 100).toFixed(1)}%`,
    Proyectado: row.projected,
    Real: row.real,
  }));
}

export function toLiquiditySummaryRows(status: LiquidityStatus, scope: ReportScope) {
  return [
    { Indicador: "Filtro", Valor: scope },
    { Indicador: "Estado", Valor: status.label },
    {
      Indicador: "Ratio de cobertura",
      Valor: Number.isFinite(status.ratio) ? status.ratio.toFixed(2) : "N/A",
    },
    { Indicador: "Saldo actual", Valor: status.currentBalance },
    { Indicador: "Ingresos proyectados", Valor: status.projectedIncomes },
    { Indicador: "Egresos proyectados", Valor: status.projectedExpenses },
    { Indicador: "Costos fijos", Valor: status.fixedCosts },
  ];
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
