import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { BarChart3, ClipboardList, Landmark, PlusCircle } from "lucide-react";

import { BackButton } from "@/components/back-button";
import { LogoutButton } from "@/components/logout-button";
import { RealtimeRefresh } from "@/components/realtime-refresh";
import { ThemeToggle } from "@/components/theme-toggle";
import { roleHome } from "@/lib/auth";
import type { UserRole } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const navItems: Array<{
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  roles: UserRole[];
}> = [
  { href: "/dashboard", icon: BarChart3, label: "Admin", roles: ["admin"] },
  { href: "/operator", icon: PlusCircle, label: "Carga", roles: ["admin", "operator"] },
  {
    href: "/treasury",
    icon: ClipboardList,
    label: "Tesoreria",
    roles: ["admin", "treasury"],
  },
];

const roleLabels: Record<UserRole, string> = {
  admin: "Administracion",
  operator: "Operacion",
  treasury: "Tesoreria",
};

type AppShellProps = {
  active: string;
  children: ReactNode;
  role: UserRole;
  title: string;
};

export function AppShell({ active, children, role, title }: AppShellProps) {
  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        backgroundImage: `radial-gradient(circle at 50% 0%, var(--bg-surface-alt) 0%, transparent 50%),
          linear-gradient(90deg, var(--border-glass) 1px, transparent 1px),
          linear-gradient(180deg, var(--border-glass) 1px, transparent 1px)`,
        backgroundSize: "100% 100%, 32px 32px, 32px 32px",
      }}
    >
      <RealtimeRefresh />
      <header
        className="sticky top-0 z-10 border-b backdrop-blur-xl"
        style={{
          background: "var(--bg-overlay)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="h-1" style={{ background: "var(--gradient-bar)" }} />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link className="flex items-center gap-3 font-semibold" href={roleHome[role]}>
            <span
              className="flex size-10 items-center justify-center rounded-xl shadow-sm"
              style={{
                background: "var(--accent-amber)",
                color: "var(--text-inverse)",
              }}
            >
              <Landmark className="size-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span style={{ color: "var(--text-primary)" }}>Cuchermercado MIS</span>
              <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                {roleLabels[role]}
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 rounded-xl border p-1 md:flex"
            style={{
              background: "var(--bg-inset)",
              borderColor: "var(--border-primary)",
            }}
          >
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.href;
              return (
                <Link
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-all duration-200",
                  )}
                  href={item.href}
                  key={item.href}
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    background: isActive ? "var(--bg-surface)" : "transparent",
                    boxShadow: isActive ? "var(--shadow-card)" : "none",
                  }}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <BackButton role={role} />
            <LogoutButton />
          </div>
        </div>

        <div
          className="border-t px-4 py-2 md:hidden"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <nav className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.href;
                return (
                  <Link
                    className={cn(
                      "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-all",
                    )}
                    href={item.href}
                    key={item.href}
                    style={{
                      color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                      background: isActive ? "var(--bg-surface)" : "transparent",
                    }}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <ThemeToggle />
            <BackButton role={role} />
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
        <div
          className="flex flex-col gap-3 rounded-xl border p-5 backdrop-blur sm:flex-row sm:items-end sm:justify-between"
          style={{
            background: "var(--bg-overlay)",
            borderColor: "var(--border-primary)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--accent-amber)" }}
            >
              Rol: {roleLabels[role]}
            </p>
            <h1
              className="mt-1 text-2xl font-semibold sm:text-3xl"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h1>
          </div>
          <div
            className="h-2 w-24 rounded-full"
            style={{ background: "var(--gradient-bar)" }}
          />
        </div>
        {children}
      </main>
    </div>
  );
}
