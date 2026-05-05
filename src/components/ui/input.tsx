import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const fieldClasses =
  "h-11 w-full rounded-lg border px-3 text-sm outline-none transition-all duration-200 placeholder:text-[var(--text-tertiary)]";

const fieldStyle = {
  background: "var(--bg-elevated)",
  borderColor: "var(--border-primary)",
  color: "var(--text-primary)",
};

export function Input({ className, style, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        fieldClasses,
        "hover:border-[var(--text-tertiary)] focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-soft)]",
        className,
      )}
      style={{ ...fieldStyle, ...style }}
      {...props}
    />
  );
}

export function Select({ className, style, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        fieldClasses,
        "hover:border-[var(--text-tertiary)] focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-soft)]",
        className,
      )}
      style={{ ...fieldStyle, ...style }}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-semibold", className)}
      style={{ color: "var(--text-secondary)" }}
      {...props}
    />
  );
}
