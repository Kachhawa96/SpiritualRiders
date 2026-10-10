"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import { isLiveRoute } from "@/config/site";
import { isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface PrimaryLinkProps {
  item: NavItem;
  className?: string;
  idleClassName?: string;
  activeClassName?: string;
  onNavigate?: () => void;
  children?: ReactNode;
}

export function PrimaryLink({
  item,
  className,
  idleClassName,
  activeClassName,
  onNavigate,
  children,
}: PrimaryLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onNavigate?.();
      if (item.href === "/" && pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    },
    [item.href, pathname, onNavigate]
  );

  return (
    <Link
      href={item.href}
      prefetch={isLiveRoute(item.href)}
      aria-current={active ? "page" : undefined}
      data-active={active ? "true" : undefined}
      onClick={handleClick}
      className={cn(className, active ? activeClassName : idleClassName)}
    >
      {children ?? item.label}
    </Link>
  );
}
