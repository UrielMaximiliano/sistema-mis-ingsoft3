"use client";

import { BellRing, CheckCircle2, MailWarning } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { triggerLiquidityAlert } from "@/lib/alerts";
import type { LiquidityStatus } from "@/lib/liquidity";
import { createClient } from "@/lib/supabase/browser";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

export function AlertPanel({ status }: { status: LiquidityStatus }) {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const hasAlert = status.alertLevel !== "none";

  async function sendAlert() {
    setSending(true);
    setMessage("");

    if (!hasSupabaseEnv()) {
      setTimeout(() => {
        setMessage("Modo demo: se generaria una alerta por correo para gerencia.");
        setSending(false);
      }, 800);
      return;
    }

    try {
      const result = await triggerLiquidityAlert(createClient(), status, recipient || undefined);
      if (result?.delivered) {
        setMessage("Alerta enviada a la casilla configurada.");
      } else {
        setMessage(result?.message ?? "Alerta procesada, pero no enviada.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo enviar la alerta.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="border-stone-200 bg-white">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-slate-900">Motor de notificaciones</CardTitle>
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
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-700">
            {hasAlert
              ? `Alerta ${status.alertLevel === "urgent" ? "urgente" : "de riesgo"} pendiente.`
              : "Sin alerta pendiente para el periodo actual."}
          </p>
          <div className="flex flex-col gap-2 sm:items-end">
            <Button
              className="min-w-[140px]"
              disabled={!hasAlert || sending}
              onClick={sendAlert}
              type="button"
              variant={sending ? "secondary" : "outline"}
            >
              <BellRing className={cn("size-4", sending && "animate-bounce")} />
              {sending ? "Enviando..." : "Enviar alerta"}
            </Button>
            {message ? (
              <p className="animate-in fade-in slide-in-from-top-1 text-xs font-medium text-slate-500">
                {message}
              </p>
            ) : null}
          </div>
        </div>

        {hasAlert && (
          <div className="grid gap-2 border-t border-stone-100 pt-4 animate-in fade-in slide-in-from-bottom-2">
            <Label htmlFor="recipient">Enviar a (opcional)</Label>
            <Input
              id="recipient"
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="gerencia@cuchermercado.test"
              type="email"
              value={recipient}
            />
            <p className="text-[10px] text-slate-400">
              Si se deja vacío, se enviará al correo configurado por defecto.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
