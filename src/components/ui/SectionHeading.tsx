/**
 * SectionHeading — editorial eyebrow, title, and subtitle.
 */

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as: Tag = "h2",
  className,
  id,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <header className={cn(centered && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? (
        <div
          className={cn(
            "flex items-center gap-4",
            centered && "justify-center"
          )}
        >
          <span className="h-px w-8 bg-gold-500" aria-hidden="true" />
          <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">
            {eyebrow}
          </p>
        </div>
      ) : null}
      <Tag
        id={id}
        className={cn(
          "text-balance font-medium text-foreground",
          eyebrow && "mt-5"
        )}
      >
        {title}
      </Tag>
      {subtitle ? (
        <p
          className={cn(
            "mt-5 text-pretty text-base leading-relaxed md:text-lg",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
