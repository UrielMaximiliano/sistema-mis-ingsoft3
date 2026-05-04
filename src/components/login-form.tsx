"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/browser";
import type { UserRole } from "@/lib/supabase/types";

const demoRoutes: Record<UserRole, string> = {
  admin: "/dashboard",
  operator: "/operator",
  treasury: "/treasury",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabaseReady = hasSupabaseEnv();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!supabaseReady) {
      router.push("/dashboard");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user?.id ?? "")
      .single();

    const fallbackNext = searchParams.get("next");
    const role = (profile?.role ?? "operator") as UserRole;
    router.push(fallbackNext ?? demoRoutes[role]);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Cuchermercado MIS</h1>
          <p className="mt-2 text-sm text-slate-600">
            Ingreso con email y password para perfiles Admin, Tesoreria y Operacion.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            autoComplete="email"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@cuchermercado.local"
            required={supabaseReady}
            type="email"
            value={email}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            autoComplete="current-password"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            required={supabaseReady}
            type="password"
            value={password}
          />
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <Button disabled={loading} type="submit">
          <LogIn className="size-4" />
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>

      {!supabaseReady ? (
        <div className="mt-5 border-t border-slate-200 pt-5">
          <p className="text-sm font-medium text-slate-700">Modo demo sin Supabase</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {Object.entries(demoRoutes).map(([role, href]) => (
              <Button
                key={role}
                onClick={() => router.push(href)}
                type="button"
                variant="outline"
              >
                {role}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
