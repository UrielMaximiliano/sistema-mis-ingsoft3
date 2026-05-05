import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        "bg-[var(--skeleton-base)]",
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background: `linear-gradient(90deg, transparent, var(--skeleton-shine), transparent)`,
        }}
      />
    </div>
  );
}

export function SkeletonChart({ height = "h-[360px]" }: { height?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-lg p-5", height)} style={{ background: "var(--bg-surface)" }}>
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-64" />
      <Skeleton className="mt-2 flex-1" />
    </div>
  );
}
