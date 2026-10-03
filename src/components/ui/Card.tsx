/**
 * Card — quiet surface for shell content.
 * Hover lift is optional. The resting state is complete on touch devices.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children?: ReactNode;
  className?: string;
  index?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  interactive?: boolean;
}

export function Card({
  children,
  className,
  index,
  eyebrow,
  title,
  description,
  interactive = false,
}: CardProps) {
  return (
    <article
      className={cn(
        "card-surface flex h-full flex-col p-7 md:p-8",
        interactive && "card-interactive",
        className
      )}
    >
      {index ? (
        <span className="font-display text-sm tracking-[0.28em] text-gold-500">
          {index}
        </span>
      ) : null}
      {eyebrow ? (
        <p
          className={cn(
            "text-[0.68rem] uppercase tracking-[0.32em] text-gold-500",
            index && "mt-5"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h3 className={cn("font-medium text-foreground", (index || eyebrow) && "mt-4")}>
          {title}
        </h3>
      ) : null}
      {description ? <p className="mt-4 text-sm leading-relaxed">{description}</p> : null}
      {children}
    </article>
  );
}
