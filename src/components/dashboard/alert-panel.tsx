"use client";

import { useState } from "react";
import { BellRing, CheckCircle2, MailWarning } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { triggerLiquidityAlert } from "@/lib/alerts";
import type { LiquidityStatus } from "@/lib/liquidity";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/browser";

export function AlertPanel({ status }: { status: LiquidityStatus }) {
  const [message, setMessage] = useState("");
  const hasAlert = status.alertLevel !== "none";

  async function sendAlert() {
    setMessage("");

    if (!hasSupabaseEnv()) {
      setMessage("Modo demo: se generaria una alerta por correo para gerencia.");
      return;
    }

    try {
      const result = await triggerLiquidityAlert(createClient(), status);
      if (result?.delivered) {
        setMessage("Alerta enviada a la casilla configurada.");
      } else {
        setMessage(result?.message ?? "Alerta procesada, pero no enviada.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo enviar la alerta.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Motor de notificaciones</CardTitle>
            <p className="mt-2 text-sm text-slate-600">
              Activa alerta proactiva cuando el semaforo entra en Amarillo o Rojo.
            </p>
          </div>
          {hasAlert ? (
            <MailWarning className="size-6 text-amber-600" />
          ) : (
            <CheckCircle2 className="size-6 text-emerald-600" />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700">
          {hasAlert
            ? `Alerta ${status.alertLevel === "urgent" ? "urgente" : "de riesgo"} pendiente.`
            : "Sin alerta pendiente para el periodo actual."}
        </p>
        <div className="flex flex-col gap-2 sm:items-end">
          <Button disabled={!hasAlert} onClick={sendAlert} type="button" variant="outline">
            <BellRing className="size-4" />
            Enviar alerta
          </Button>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
