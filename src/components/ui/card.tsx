import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-xl border transition-all duration-300",
        "hover:shadow-[var(--shadow-elevated)]",
        className,
      )}
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-primary)",
        boxShadow: "var(--shadow-card)",
        ...style,
      }}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-sm font-semibold uppercase tracking-[0.12em]",
        className,
      )}
      style={{ color: "var(--text-tertiary)" }}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-2", className)} {...props} />;
}
