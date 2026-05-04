import type { CashMovement, LiquidityStatus } from "@/lib/liquidity";

export type LiquidityAlertStrategy = {
  evaluate(movements: CashMovement[]): LiquidityStatus;
};

export type LiquidityThresholds = {
  fixedCostCategories: string[];
  minimumCoverageRatio: number;
};

const defaultThresholds: LiquidityThresholds = {
  fixedCostCategories: ["Sueldos", "Servicios", "Proveedores Criticos"],
  minimumCoverageRatio: 1,
};

export class DefaultLiquidityAlertStrategy implements LiquidityAlertStrategy {
  private readonly fixedCostNames: Set<string>;
  private readonly minimumCoverageRatio: number;

  constructor(thresholds: LiquidityThresholds = defaultThresholds) {
    this.fixedCostNames = new Set(thresholds.fixedCostCategories);
    this.minimumCoverageRatio = thresholds.minimumCoverageRatio;
  }

  evaluate(movements: CashMovement[]): LiquidityStatus {
    const currentBalance = movements
      .filter((movement) => !movement.isProjected)
      .reduce((total, movement) => {
        return total + (movement.type === "income" ? movement.amount : -movement.amount);
      }, 0);

    const projectedIncomes = movements
      .filter((movement) => movement.isProjected && movement.type === "income")
      .reduce((total, movement) => total + movement.amount, 0);

    const projectedExpenses = movements
      .filter((movement) => movement.isProjected && movement.type === "expense")
      .reduce((total, movement) => total + movement.amount, 0);

    const fixedCosts = movements
      .filter(
        (movement) =>
          movement.isProjected &&
          movement.type === "expense" &&
          this.fixedCostNames.has(movement.category),
      )
      .reduce((total, movement) => total + movement.amount, 0);

    const availableLiquidity = currentBalance + projectedIncomes;
    const ratio =
      projectedExpenses === 0
        ? Number.POSITIVE_INFINITY
        : availableLiquidity / projectedExpenses;

    if (currentBalance < fixedCosts) {
      return {
        alertLevel: "urgent",
        color: "red",
        currentBalance,
        fixedCosts,
        label: "Critico",
        message: "El saldo real no cubre los costos fijos prioritarios.",
        projectedExpenses,
        projectedIncomes,
        ratio,
      };
    }

    if (ratio < this.minimumCoverageRatio) {
      return {
        alertLevel: "risk",
        color: "yellow",
        currentBalance,
        fixedCosts,
        label: "Riesgo",
        message: "La liquidez cubre costos fijos, pero no todos los egresos proyectados.",
        projectedExpenses,
        projectedIncomes,
        ratio,
      };
    }

    return {
      alertLevel: "none",
      color: "green",
      currentBalance,
      fixedCosts,
      label: "OK",
      message: "La cobertura proyectada es suficiente para el periodo.",
      projectedExpenses,
      projectedIncomes,
      ratio,
    };
  }
}

export const defaultLiquidityAlertStrategy = new DefaultLiquidityAlertStrategy();
