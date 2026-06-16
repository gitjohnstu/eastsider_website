"use client";

import Link from "next/link";
import { useEffect } from "react";
import { cityList, allNavGroups, getCityNavGroups } from "@/config/city";
import type { NavGroupKey, CitySlug } from "@/config/city";
import { SearchBar } from "@/components/SearchBar";

interface MobileNavProps {
  citySlug: CitySlug;
  cityName: string;
  cityState: string;
  headerBg: string;
  navGroupKeys: readonly NavGroupKey[];
  onClose: () => void;
}

export function MobileNav({
  citySlug,
  cityName,
  cityState,
  headerBg,
  navGroupKeys,
  onClose,
}: MobileNavProps) {
  const cityNavGroups = getCityNavGroups(navGroupKeys);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col"
        style={{ backgroundColor: headerBg }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <span className="font-display text-[22px] italic font-bold text-white">
            Eastsider
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded text-white/50 transition hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Current city */}
        <div className="px-6 pt-5 pb-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.5em] text-white/30">
            Browsing
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {cityName}, {cityState}
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-4 pb-4">
          <Link
            href={`/${citySlug}/articles`}
            onClick={onClose}
            className="rounded px-3 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            Articles
          </Link>
          {(Object.entries(cityNavGroups) as [NavGroupKey, (typeof allNavGroups)[NavGroupKey]][]).map(
            ([key, group]) => (
              <Link
                key={key}
                href={`/${citySlug}/search?group=${key}`}
                onClick={onClose}
                className="rounded px-3 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                {group.label}
              </Link>
            )
          )}
        </nav>

        {/* Divider */}
        <div className="mx-6 h-px bg-white/8" />

        {/* City switcher */}
        <div className="flex flex-col px-4 py-4">
          <p className="px-3 pb-2 text-[9px] font-semibold uppercase tracking-[0.4em] text-white/30">
            Switch City
          </p>
          {cityList.map((city) => {
            const isCurrent = city.slug === citySlug;
            return (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                onClick={onClose}
                className={`flex items-center justify-between rounded px-3 py-2.5 text-sm transition ${
                  isCurrent
                    ? "text-white"
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>
                  {city.name}
                  <span className="ml-1.5 text-xs text-white/30">{city.state}</span>
                </span>
                {isCurrent && <span className="text-[10px] text-[#c49040]">✓</span>}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-white/8" />

        {/* Search */}
        <div className="px-6 pt-5 pb-6 mt-auto">
          <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.4em] text-white/30">
            Search
          </p>
          <SearchBar compact dark citySlug={citySlug} />
        </div>
      </div>
    </>
  );
}
