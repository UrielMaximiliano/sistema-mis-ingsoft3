import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50",
  {
    defaultVariants: {
      variant: "primary",
    },
    variants: {
      variant: {
        ghost: "text-slate-600 hover:bg-stone-100 hover:text-slate-950 focus-visible:outline-slate-400",
        outline:
          "border border-stone-300 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-stone-50 focus-visible:outline-slate-400",
        primary:
          "bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus-visible:outline-slate-600",
        success:
          "bg-teal-700 text-white shadow-sm hover:bg-teal-800 focus-visible:outline-teal-600",
        warning:
          "bg-amber-500 text-slate-950 shadow-sm hover:bg-amber-400 focus-visible:outline-amber-500",
      },
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
