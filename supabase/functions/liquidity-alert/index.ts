import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "npm:resend";

type AlertPayload = {
  body: string;
  level: "risk" | "urgent";
  recipient?: string;
  subject: string;
};

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Origin": "*",
};

async function logNotification(
  request: Request,
  payload: AlertPayload,
  deliveryStatus: "sent" | "simulated" | "failed",
  recipient: string,
  provider: string,
  providerResponse: Record<string, unknown>,
) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const authorization = request.headers.get("Authorization");

  if (!supabaseUrl || !supabaseAnonKey || !authorization) {
    return;
  }

  await fetch(`${supabaseUrl}/rest/v1/alert_notifications`, {
    body: JSON.stringify({
      body: payload.body,
      delivery_status: deliveryStatus,
      level: payload.level,
      provider,
      provider_response: providerResponse,
      recipient,
      subject: payload.subject,
    }),
    headers: {
      apikey: supabaseAnonKey,
      Authorization: authorization,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    method: "POST",
  });
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { headers: corsHeaders, status: 405 });
  }

  const payload = (await request.json()) as AlertPayload;
  const destination = payload.recipient ?? Deno.env.get("LIQUIDITY_ALERT_EMAIL") ?? "maxirodri675@gmail.com";
  const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "re_SDyZ7Pqy_PB6qX8sWnCkVMxn7PuxpcXcW";

  if (!resendApiKey) {
    await logNotification(request, payload, "simulated", destination, "supabase-edge", {
      message: "Prototype mode: RESEND_API_KEY is not configured.",
    });

    return Response.json(
      {
        delivered: false,
        message: "Alerta registrada en Supabase como correo simulado.",
        payload,
        simulated: true,
      },
      { headers: corsHeaders, status: 202 },
    );
  }

  try {
    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: "Cuchermercado <onboarding@resend.dev>",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: ${payload.level === "urgent" ? "#b91c1c" : "#d97706"}; padding: 24px; color: white;">
            <h1 style="margin: 0; font-size: 20px;">${payload.subject}</h1>
          </div>
          <div style="padding: 24px; color: #1e293b;">
            <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">
              Se ha detectado una situación que requiere atención inmediata en el flujo de caja.
            </p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
              <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; color: #475569;">${payload.body}</pre>
            </div>
            <p style="font-size: 14px; color: #64748b;">
              Este es un correo automático generado por el Sistema de Gestión de Cuchermercado.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
            &copy; 2026 Cuchermercado MIS - Ingeniería de Software III
          </div>
        </div>
      `,
      subject: payload.subject,
      to: [destination],
    });

    if (error) {
      await logNotification(request, payload, "failed", destination, "resend", error as any);
      return Response.json({ delivered: false, error }, { headers: corsHeaders, status: 500 });
    }

    await logNotification(request, payload, "sent", destination, "resend", data as any);

    return Response.json(
      {
        delivered: true,
        level: payload.level,
        provider: "resend",
        result: data,
      },
      { headers: corsHeaders },
    );
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ delivered: false, error }, { headers: corsHeaders, status: 500 });
  }
});
