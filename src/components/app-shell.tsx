import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { BarChart3, ClipboardList, Landmark, PlusCircle } from "lucide-react";

import { BackButton } from "@/components/back-button";
import { LogoutButton } from "@/components/logout-button";
import { RealtimeRefresh } from "@/components/realtime-refresh";
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
    <div className="min-h-screen bg-stone-50 text-slate-950 [background-image:linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,42,0.035)_1px,transparent_1px)] [background-size:28px_28px]">
      <RealtimeRefresh />
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur">
        <div className="h-1 bg-[linear-gradient(90deg,#0f766e,#ca8a04,#2563eb)]" />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link className="flex items-center gap-3 font-semibold" href={roleHome[role]}>
            <span className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
              <Landmark className="size-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span>Cuchermercado MIS</span>
              <span className="text-xs font-medium text-slate-500">{roleLabels[role]}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 p-1 md:flex">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950",
                    active === item.href &&
                      "bg-white text-slate-950 shadow-[0_1px_2px_rgba(15,23,42,0.08)]",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <BackButton role={role} />
            <LogoutButton />
          </div>
        </div>

        <div className="border-t border-stone-200 px-4 py-2 md:hidden">
          <nav className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    className={cn(
                      "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-stone-100",
                      active === item.href && "bg-stone-100 text-slate-950",
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <BackButton role={role} />
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
        <div className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white/85 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Rol: {roleLabels[role]}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{title}</h1>
          </div>
          <div className="h-2 w-24 rounded-full bg-[linear-gradient(90deg,#0f766e,#ca8a04,#2563eb)]" />
        </div>
        {children}
      </main>
    </div>
  );
}
