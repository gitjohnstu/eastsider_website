import Link from "next/link";
import { siteConfig, allNavGroups, getCityNavGroups, getCity } from "@/config/city";
import type { NavGroupKey, CitySlug } from "@/config/city";

interface FooterProps {
  citySlug: CitySlug;
  cityName: string;
  cityState: string;
}

export function Footer({ citySlug, cityName, cityState }: FooterProps) {
  const cityConfig = getCity(citySlug);
  const cityNavGroups = cityConfig
    ? getCityNavGroups(cityConfig.navGroupKeys)
    : ({} as ReturnType<typeof getCityNavGroups>);
  const accent = cityConfig?.theme.accent ?? "#9e7040";

  return (
    <footer className="mt-auto bg-stone-950 text-stone-400">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1" style={{ background: `${accent}33` }} />
          <span className="font-display text-xl italic" style={{ color: `${accent}66` }}>✦</span>
          <div className="h-px flex-1" style={{ background: `${accent}33` }} />
        </div>

        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <p className="font-display text-3xl italic font-bold text-white">{siteConfig.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-stone-500">
              {cityConfig?.tagline ?? `Your guide to ${cityName}.`}
            </p>
            <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.5em] text-stone-700">
              {cityName}, {cityState}
            </p>
          </div>
          <nav className="flex flex-col gap-3 text-sm">
            <p
              className="text-[9px] font-semibold uppercase tracking-[0.5em] mb-1"
              style={{ color: accent }}
            >
              Explore
            </p>
            <Link href={`/${citySlug}/articles`} className="transition-colors hover:text-white">
              Articles
            </Link>
            {(Object.entries(cityNavGroups) as [NavGroupKey, (typeof allNavGroups)[NavGroupKey]][]).map(
              ([key, group]) => (
                <Link
                  key={key}
                  href={`/${citySlug}/search?group=${key}`}
                  className="transition-colors hover:text-white"
                >
                  {group.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <div className="mt-12 border-t border-stone-800/50 pt-5 flex items-center justify-between">
          <p className="text-xs text-stone-700 tracking-wide">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="text-xs text-stone-700">{cityName}, {cityState}</p>
        </div>
      </div>
    </footer>
  );
}
