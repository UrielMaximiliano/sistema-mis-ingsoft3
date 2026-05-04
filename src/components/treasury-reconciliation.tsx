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
            <p className="mt-2 text-sm text-slate-600">Semana desde {weekStart}</p>
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
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Registros
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-950">{movements.length}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-teal-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
              Real
            </p>
            <p className="mt-1 text-xl font-semibold text-teal-900">{formatMoney(totals.real)}</p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
              Proyectado
            </p>
            <p className="mt-1 text-xl font-semibold text-blue-900">
              {formatMoney(totals.projected)}
            </p>
          </div>
        </div>

        {message ? (
          <p className="mb-4 rounded-lg bg-stone-100 px-3 py-2 text-sm font-medium text-slate-700">
            {message}
          </p>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-stone-50">
              <tr className="border-y border-stone-200 text-xs uppercase tracking-[0.08em] text-slate-500">
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
                movements.map((movement) => (
                  <tr className="border-b border-stone-100 hover:bg-stone-50" key={movement.id}>
                    <td className="py-3 pr-4 text-slate-700">{movement.date}</td>
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {movement.type === "income" ? "Ingreso" : "Egreso"}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{movement.category}</td>
                    <td className="py-3 pr-4 text-slate-700">{movement.channel}</td>
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {formatMoney(movement.amount)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          movement.isProjected
                            ? "rounded-lg bg-blue-50 px-2.5 py-1 font-semibold text-blue-700"
                            : "rounded-lg bg-teal-50 px-2.5 py-1 font-semibold text-teal-700"
                        }
                      >
                        {movement.isProjected ? "Proyectado" : "Real"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-6 text-center text-sm text-slate-500" colSpan={6}>
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
