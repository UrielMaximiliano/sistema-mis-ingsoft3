"use client";

import type { ComponentType } from "react";
import { Building2, Filter, Store } from "lucide-react";

import type { ReportScope } from "@/lib/reporting";
import { cn } from "@/lib/utils";

type ChannelScopeFilterProps = {
  onChange: (scope: ReportScope) => void;
  value: ReportScope;
};

export function ChannelScopeFilter({ onChange, value }: ChannelScopeFilterProps) {
  const options: Array<{
    icon: ComponentType<{ className?: string }>;
    label: ReportScope;
  }> = [
    { icon: Filter, label: "Todo" },
    { icon: Building2, label: "Mayorista" },
    { icon: Store, label: "Minorista" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label
        className="flex items-center gap-2 text-sm font-semibold"
        style={{ color: "var(--text-secondary)" }}
      >
        <Filter className="size-4" />
        Filtrar canal
      </label>
      <div
        className="grid grid-cols-3 rounded-xl border p-1"
        style={{
          background: "var(--bg-inset)",
          borderColor: "var(--border-primary)",
        }}
      >
        {options.map((option) => {
          const Icon = option.icon;
          const selected = value === option.label;

          return (
            <button
              aria-pressed={selected}
              className={cn(
                "inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-all duration-200",
              )}
              key={option.label}
              onClick={() => onChange(option.label)}
              style={{
                color: selected ? "var(--text-primary)" : "var(--text-secondary)",
                background: selected ? "var(--bg-surface)" : "transparent",
                boxShadow: selected ? "var(--shadow-card)" : "none",
              }}
              type="button"
            >
              <Icon className="hidden size-4 sm:block" />
              <span className="truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
