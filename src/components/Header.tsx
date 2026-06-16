import Link from "next/link";
import { siteConfig, allNavGroups, getCityNavGroups } from "@/config/city";
import type { NavGroupKey, CitySlug } from "@/config/city";
import { SearchBar } from "@/components/SearchBar";
import { CityDropdown } from "@/components/CityDropdown";
import { MobileMenuButton } from "@/components/MobileMenuButton";

interface HeaderProps {
  citySlug: CitySlug;
  cityName: string;
  cityState: string;
  headerBg: string;
  navGroupKeys: readonly NavGroupKey[];
}

export function Header({ citySlug, cityName, cityState, headerBg, navGroupKeys }: HeaderProps) {
  const cityNavGroups = getCityNavGroups(navGroupKeys);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/5"
      style={{ backgroundColor: headerBg }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 md:gap-6">
        {/* Hamburger — mobile only */}
        <MobileMenuButton
          citySlug={citySlug}
          cityName={cityName}
          cityState={cityState}
          headerBg={headerBg}
          navGroupKeys={navGroupKeys}
        />

        {/* Wordmark */}
        <Link href={`/${citySlug}`} className="group shrink-0">
          <span className="font-display text-[22px] italic font-bold tracking-tight text-white transition-colors group-hover:text-[#c49040]">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-1 items-center gap-7 text-[11px] tracking-[0.12em] uppercase text-white/40">
          <Link
            href={`/${citySlug}/articles`}
            className="nav-link transition-colors hover:text-white"
          >
            Articles
          </Link>
          {(Object.entries(cityNavGroups) as [NavGroupKey, (typeof allNavGroups)[NavGroupKey]][]).map(
            ([key, group]) => (
              <Link
                key={key}
                href={`/${citySlug}/search?group=${key}`}
                className="nav-link transition-colors hover:text-white"
              >
                {group.label}
              </Link>
            )
          )}
        </nav>

        {/* City dropdown — always visible */}
        <CityDropdown
          currentSlug={citySlug}
          currentName={cityName}
          currentState={cityState}
        />

        {/* Search bar — desktop only */}
        <div className="hidden md:flex w-full max-w-[220px]">
          <SearchBar compact dark citySlug={citySlug} />
        </div>
      </div>
    </header>
  );
}
