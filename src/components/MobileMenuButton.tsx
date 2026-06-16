"use client";

import { useState } from "react";
import { MobileNav } from "@/components/MobileNav";
import type { NavGroupKey, CitySlug } from "@/config/city";

interface MobileMenuButtonProps {
  citySlug: CitySlug;
  cityName: string;
  cityState: string;
  headerBg: string;
  navGroupKeys: readonly NavGroupKey[];
}

export function MobileMenuButton({
  citySlug,
  cityName,
  cityState,
  headerBg,
  navGroupKeys,
}: MobileMenuButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="flex h-9 w-9 items-center justify-center rounded text-white/60 transition hover:text-white md:hidden"
      >
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
          <path d="M0 1H20M0 7H20M0 13H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <MobileNav
          citySlug={citySlug}
          cityName={cityName}
          cityState={cityState}
          headerBg={headerBg}
          navGroupKeys={navGroupKeys}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
