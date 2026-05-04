import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type AlertPayload = {
  body: string;
  level: "risk" | "urgent";
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
  const destination = Deno.env.get("LIQUIDITY_ALERT_EMAIL") ?? "gerencia@cuchermercado.test";
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

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

  const emailResponse = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from: "Cuchermercado MIS <alerts@resend.dev>",
      subject: payload.subject,
      text: payload.body,
      to: [destination],
    }),
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!emailResponse.ok) {
    const error = await emailResponse.text();
    await logNotification(request, payload, "failed", destination, "resend", {
      error,
    });

    return Response.json(
      {
        delivered: false,
        error,
      },
      { headers: corsHeaders, status: 502 },
    );
  }

  const result = await emailResponse.json();
  await logNotification(request, payload, "sent", destination, "resend", result);

  return Response.json(
    {
      delivered: true,
      level: payload.level,
      provider: "resend",
      result,
    },
    { headers: corsHeaders },
  );
});
