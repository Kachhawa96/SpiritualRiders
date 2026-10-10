"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useCallback, useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

interface AppShellProps {
  children: ReactNode;
  footer: ReactNode;
  contactInfo?: {
    email?: string;
    tagline?: string;
  };
  logoUrl?: string | null;
}

export function AppShell({ children, footer, contactInfo, logoUrl }: AppShellProps) {
  const pathname = usePathname();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [openPath, setOpenPath] = useState(pathname);

  if (pathname !== openPath) {
    setOpenPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    // When navigating to the home landing page without a hash fragment, ensure scroll position is reset to the top
    if (pathname === "/" && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  const openMenu = useCallback(() => {
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <MotionConfig reducedMotion="user" transition={{ ease: EASE_OUT_EXPO }}>
        <div id="main-content" className="flex flex-1 flex-col">
          {children}
        </div>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE_OUT_EXPO }}>
      <Header
        menuOpen={open}
        menuId={menuId}
        onMenuOpen={openMenu}
        inert={open}
        logoUrl={logoUrl}
      />
      <AnimatePresence>
        {open ? (
          <MobileNav
            key="mobile-nav"
            id={menuId}
            onClose={closeMenu}
            email={contactInfo?.email}
            tagline={contactInfo?.tagline}
            logoUrl={logoUrl}
          />
        ) : null}
      </AnimatePresence>
      <main
        id="main-content"
        inert={open ? true : undefined}
        className="flex flex-1 flex-col"
      >
        {children}
      </main>
      <div inert={open ? true : undefined}>{footer}</div>
    </MotionConfig>
  );
}
