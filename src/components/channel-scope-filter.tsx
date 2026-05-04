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
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Filter className="size-4" />
        Filtrar canal
      </label>
      <div className="grid grid-cols-3 rounded-lg border border-stone-200 bg-stone-50 p-1">
        {options.map((option) => {
          const Icon = option.icon;
          const selected = value === option.label;

          return (
            <button
              aria-pressed={selected}
              className={cn(
                "inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950",
                selected && "bg-white text-slate-950 shadow-sm",
              )}
              key={option.label}
              onClick={() => onChange(option.label)}
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
