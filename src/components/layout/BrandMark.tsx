import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
  logoUrl?: string | null;
}

export function BrandMark({ compact = false, className, logoUrl }: BrandMarkProps) {
  const isSvg = Boolean(
    logoUrl &&
      (logoUrl.toLowerCase().includes(".svg") ||
        logoUrl.toLowerCase().includes("image/svg+xml"))
  );

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-3", className)}
      aria-label={`${SITE_CONFIG.name}, home`}
    >
      {logoUrl ? (
        <div className="relative size-10 shrink-0 overflow-hidden">
          <Image
            src={logoUrl}
            alt={SITE_CONFIG.name}
            fill
            sizes="40px"
            className="object-contain"
            priority
            unoptimized={isSvg}
          />
        </div>
      ) : (
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center border border-gold-500/70 font-display text-sm tracking-[0.14em] text-gold-400"
        >
          SR
        </span>
      )}
      {compact ? null : (
        <span className="flex flex-col">
          <span className="font-display text-lg leading-none tracking-tight text-foreground">
            {SITE_CONFIG.name}
          </span>
          <span className="mt-1 text-[0.62rem] uppercase tracking-[0.32em] text-graphite-300">
            Brotherhood
          </span>
        </span>
      )}
    </Link>
  );
}
