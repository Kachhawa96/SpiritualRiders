import type { CalculatedRideStatus } from "@/lib/ride-labels";
import { CALCULATED_STATUS_BADGE } from "@/lib/ride-labels";
import { cn } from "@/lib/utils";

interface RideStatusBadgeProps {
  status: CalculatedRideStatus;
  className?: string;
}

export function RideStatusBadge({ status, className }: RideStatusBadgeProps) {
  const label = CALCULATED_STATUS_BADGE[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] backdrop-blur-md transition-colors",
        status === "upcoming" &&
          "border border-gold-500/40 bg-obsidian-950/85 text-gold-400 shadow-[0_2px_12px_rgba(0,0,0,0.6)]",
        status === "ongoing" &&
          "border border-emerald-500/50 bg-obsidian-950/85 text-emerald-400 shadow-[0_2px_12px_rgba(0,0,0,0.6)]",
        status === "completed" &&
          "border border-border-subtle bg-obsidian-950/85 text-graphite-300 shadow-[0_2px_12px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {status === "ongoing" && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
      )}
      {status === "upcoming" && (
        <span className="h-1.5 w-1.5 rounded-full bg-gold-400/90" aria-hidden="true" />
      )}
      {status === "completed" && (
        <span className="h-1.5 w-1.5 rounded-full bg-graphite-400/60" aria-hidden="true" />
      )}
      <span>{label}</span>
    </span>
  );
}
