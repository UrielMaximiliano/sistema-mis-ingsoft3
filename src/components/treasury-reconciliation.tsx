"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/liquidity";
import type { CashMovement } from "@/lib/liquidity";
import { lockWeek } from "@/lib/repositories/financial-mutations";

export function TreasuryReconciliation({ movements }: { movements: CashMovement[] }) {
  const [locked, setLocked] = useState(false);
  const [locking, setLocking] = useState(false);
  const [message, setMessage] = useState("");
  const weekStart = "2026-04-27";
  const totals = useMemo(
    () =>
      movements.reduce(
        (acc, movement) => {
          if (movement.isProjected) {
            acc.projected += movement.amount;
          } else {
            acc.real += movement.amount;
          }

          return acc;
        },
        { projected: 0, real: 0 },
      ),
    [movements],
  );

  async function lockPeriod() {
    setMessage("");
    setLocking(true);

    try {
      const result = await lockWeek(weekStart);
      setLocked(true);
      setMessage(result.demo ? "Semana bloqueada en modo demo." : "Semana bloqueada.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo bloquear el periodo.";
      if (errorMessage.includes("duplicate key")) {
        setLocked(true);
        setMessage("Semana ya bloqueada.");
      } else {
        setMessage(errorMessage);
      }
    } finally {
      setLocking(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Reconciliacion semanal</CardTitle>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              Semana desde {weekStart}
            </p>
          </div>
          <Button
            disabled={locked || locking}
            onClick={lockPeriod}
            type="button"
            variant={locked ? "outline" : "warning"}
          >
            {locked ? <CheckCircle2 className="size-4" /> : <Lock className="size-4" />}
            {locking ? "Bloqueando..." : locked ? "Periodo bloqueado" : "Lock Period"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div
            className="rounded-lg border p-3"
            style={{ background: "var(--bg-inset)", borderColor: "var(--border-secondary)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-tertiary)" }}>
              Registros
            </p>
            <p className="mt-1 text-xl font-semibold font-mono" style={{ color: "var(--text-primary)" }}>
              {movements.length}
            </p>
          </div>
          <div
            className="rounded-lg border p-3"
            style={{ background: "var(--accent-emerald-soft)", borderColor: "var(--border-secondary)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--accent-emerald)" }}>
              Real
            </p>
            <p className="mt-1 text-xl font-semibold font-mono" style={{ color: "var(--text-primary)" }}>
              {formatMoney(totals.real)}
            </p>
          </div>
          <div
            className="rounded-lg border p-3"
            style={{ background: "var(--accent-cyan-soft)", borderColor: "var(--border-secondary)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--accent-cyan)" }}>
              Proyectado
            </p>
            <p className="mt-1 text-xl font-semibold font-mono" style={{ color: "var(--text-primary)" }}>
              {formatMoney(totals.projected)}
            </p>
          </div>
        </div>

        {message ? (
          <p
            className="mb-4 rounded-lg px-3 py-2 text-sm font-medium"
            style={{ background: "var(--bg-inset)", color: "var(--text-secondary)" }}
          >
            {message}
          </p>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr
                className="border-y text-xs uppercase tracking-[0.08em]"
                style={{
                  background: "var(--bg-inset)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-tertiary)",
                }}
              >
                <th className="py-3 pr-4">Fecha</th>
                <th className="py-3 pr-4">Tipo</th>
                <th className="py-3 pr-4">Categoria</th>
                <th className="py-3 pr-4">Canal</th>
                <th className="py-3 pr-4">Importe</th>
                <th className="py-3 pr-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {movements.length ? (
                movements.map((movement, i) => (
                  <tr
                    className="border-b transition-colors"
                    key={movement.id}
                    style={{
                      borderColor: "var(--border-secondary)",
                      background: i % 2 === 1 ? "var(--bg-surface-alt)" : "transparent",
                    }}
                  >
                    <td className="py-3 pr-4" style={{ color: "var(--text-secondary)" }}>
                      {movement.date}
                    </td>
                    <td className="py-3 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>
                      {movement.type === "income" ? "Ingreso" : "Egreso"}
                    </td>
                    <td className="py-3 pr-4" style={{ color: "var(--text-secondary)" }}>
                      {movement.category}
                    </td>
                    <td className="py-3 pr-4" style={{ color: "var(--text-secondary)" }}>
                      {movement.channel}
                    </td>
                    <td className="py-3 pr-4 font-medium font-mono" style={{ color: "var(--text-primary)" }}>
                      {formatMoney(movement.amount)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="rounded-lg px-2.5 py-1 font-semibold text-xs"
                        style={{
                          background: movement.isProjected ? "var(--accent-cyan-soft)" : "var(--accent-emerald-soft)",
                          color: movement.isProjected ? "var(--accent-cyan)" : "var(--accent-emerald)",
                        }}
                      >
                        {movement.isProjected ? "Proyectado" : "Real"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="py-6 text-center text-sm"
                    colSpan={6}
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Sin movimientos para el filtro seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
