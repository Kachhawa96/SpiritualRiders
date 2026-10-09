/**
 * Button — gold, outline, ghost, and glow actions.
 * Renders a link when `href` is set, otherwise a button.
 */

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { isLiveRoute } from "@/config/site";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "glow";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  href?: string;
  prefetch?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  id?: string;
  "aria-label"?: string;
  "aria-current"?: "page" | "true" | "false" | boolean;
}

const base =
  "group inline-flex cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-sm border font-medium uppercase tracking-[0.22em] transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-gold-500 bg-gold-500 text-obsidian-950 hover:border-gold-400 hover:bg-gold-400 hover:shadow-glow-gold",
  outline:
    "border-charcoal-500 bg-transparent text-ivory-100 hover:border-gold-500 hover:text-gold-400 hover:bg-gold-500/5",
  ghost:
    "border-transparent bg-transparent text-graphite-200 hover:text-ivory-100 hover:bg-white/5",
  glow:
    "border-gold-500/40 bg-obsidian-900 text-gold-400 shadow-glow-gold hover:border-gold-500 hover:text-gold-300",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[0.62rem]",
  md: "h-12 px-6 text-[0.68rem]",
  lg: "h-14 px-8 text-[0.72rem]",
};

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
    >
      <path
        d="M2 7h10M8 3l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  prefetch,
  type = "button",
  disabled = false,
  onClick,
  id,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {children}
      {variant !== "ghost" ? <ArrowIcon /> : null}
    </>
  );

  if (href) {
    const shared = {
      className: classes,
      onClick,
      id,
      "aria-label": ariaLabel,
      "aria-current": ariaCurrent,
    };

    if (href.startsWith("/")) {
      return (
        <Link
          href={href}
          prefetch={prefetch ?? isLiveRoute(href)}
          {...shared}
        >
          {content}
        </Link>
      );
    }

    return (
      <a href={href} {...shared}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      id={id}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
