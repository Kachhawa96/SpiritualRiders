"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useCallback, useId, useState } from "react";
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
}

export function AppShell({ children, footer, contactInfo }: AppShellProps) {
  const pathname = usePathname();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [openPath, setOpenPath] = useState(pathname);

  if (pathname !== openPath) {
    setOpenPath(pathname);
    setOpen(false);
  }

  const openMenu = useCallback(() => {
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE_OUT_EXPO }}>
      <Header
        menuOpen={open}
        menuId={menuId}
        onMenuOpen={openMenu}
        inert={open}
      />
      <AnimatePresence>
        {open ? (
          <MobileNav
            key="mobile-nav"
            id={menuId}
            onClose={closeMenu}
            email={contactInfo?.email}
            tagline={contactInfo?.tagline}
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
