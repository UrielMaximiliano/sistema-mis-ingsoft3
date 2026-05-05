import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-40",
  {
    defaultVariants: {
      variant: "primary",
    },
    variants: {
      variant: {
        ghost:
          "hover:bg-[var(--bg-inset)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-[var(--border-primary)]",
        outline:
          "border bg-[var(--bg-surface)] text-[var(--text-secondary)] shadow-sm hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)] border-[var(--border-primary)] focus-visible:outline-[var(--border-primary)]",
        primary:
          "bg-[var(--accent-amber)] text-[var(--text-inverse)] shadow-sm hover:brightness-110 focus-visible:outline-[var(--accent-amber)]",
        secondary:
          "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-primary)] focus-visible:outline-[var(--border-primary)]",
        success:
          "bg-[var(--accent-emerald)] text-white shadow-sm hover:brightness-110 focus-visible:outline-[var(--accent-emerald)]",
        warning:
          "bg-[var(--accent-amber)] text-[var(--text-inverse)] shadow-sm hover:brightness-110 focus-visible:outline-[var(--accent-amber)]",
      },
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
