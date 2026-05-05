"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
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
    <div
      className="w-full max-w-md rounded-xl border p-6 animate-fade-in-up"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-primary)",
        boxShadow: "var(--shadow-elevated)",
      }}
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Cuchermercado MIS
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              Ingreso con email y password para perfiles Admin, Tesoreria y Operacion.
            </p>
          </div>
          <ThemeToggle />
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
          <p
            className="rounded-lg px-3 py-2 text-sm"
            style={{ background: "var(--accent-red-soft)", color: "var(--accent-red)" }}
          >
            {error}
          </p>
        ) : null}

        <Button disabled={loading} type="submit">
          <LogIn className="size-4" />
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>

      {!supabaseReady ? (
        <div
          className="mt-5 border-t pt-5"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Modo demo sin Supabase
          </p>
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
