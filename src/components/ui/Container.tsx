/**
 * Container — responsive layout wrapper with max-width constraints.
 * Two variants: "site" (wide, max 1400px) and "narrow" (max 900px).
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  variant?: "site" | "narrow";
  as?: "div" | "section" | "article" | "aside" | "header" | "footer";
  className?: string;
}

export function Container({
  children,
  variant = "site",
  as: Tag = "div",
  className,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        variant === "site" ? "container-site" : "container-narrow",
        className
      )}
    >
      {children}
    </Tag>
  );
}
