"use client";

import { BellRing, CheckCircle2, MailWarning } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { triggerLiquidityAlert } from "@/lib/alerts";
import type { LiquidityStatus } from "@/lib/liquidity";
import { createClient } from "@/lib/supabase/browser";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

export function AlertPanel({ status }: { status: LiquidityStatus }) {
  const [message, setMessage] = useState("");
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
      const result = await triggerLiquidityAlert(createClient(), status);
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

  const glowColor = status.alertLevel === "urgent" ? "var(--glow-red)" : "var(--glow-amber)";

  return (
    <Card
      style={hasAlert ? { boxShadow: `var(--shadow-card), 0 0 0 2px ${glowColor}` } : undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Motor de notificaciones</CardTitle>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              Activa alerta proactiva cuando el semaforo entra en Amarillo o Rojo.
            </p>
          </div>
          {hasAlert ? (
            <MailWarning className="size-6" style={{ color: "var(--accent-amber)" }} />
          ) : (
            <CheckCircle2 className="size-6" style={{ color: "var(--accent-emerald)" }} />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {hasAlert
              ? `Alerta ${status.alertLevel === "urgent" ? "urgente" : "de riesgo"} pendiente.`
              : "Sin alerta pendiente para el periodo actual."}
          </p>
          {message ? (
            <p className="animate-fade-in-up text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
              {message}
            </p>
          ) : null}
        </div>
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
      </CardContent>
    </Card>
  );
}
