import Link from "next/link";
import { cityList, siteConfig } from "@/config/city";

export const metadata = {
  title: siteConfig.name,
  description: "Your editorial guide to New England's finest towns.",
};

export default function CityPickerPage() {
  return (
    <div className="min-h-screen bg-[#0f0c0a] flex flex-col items-center justify-center px-4 py-20">
      {/* Masthead */}
      <div className="text-center mb-16">
        <p className="text-[9px] font-semibold uppercase tracking-[0.65em] text-[#9e7040]/60 mb-6">
          A Regional Guide
        </p>
        <h1 className="font-display text-5xl italic font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
          {siteConfig.name}
        </h1>
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-[#9e7040]/30" />
          <span className="font-display text-xl italic text-[#9e7040]/40">✦</span>
          <div className="h-px w-16 bg-[#9e7040]/30" />
        </div>
        <p className="mt-6 text-base text-stone-500 max-w-sm mx-auto leading-relaxed">
          Select a destination to explore restaurants, local guides, and things to do.
        </p>
      </div>

      {/* City cards */}
      <div className="grid gap-5 w-full max-w-3xl sm:grid-cols-3">
        {cityList.map((city) => (
          <Link
            key={city.slug}
            href={`/${city.slug}`}
            className="group relative overflow-hidden rounded-sm border border-white/8 transition-all hover:border-white/20"
            style={{ backgroundColor: city.theme.headerBg }}
          >
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <p
                className="text-[9px] font-semibold uppercase tracking-[0.5em] mb-4 transition-colors"
                style={{ color: city.theme.accent + "99" }}
              >
                {city.state}
              </p>
              <h2 className="font-display text-4xl italic font-bold text-white leading-none">
                {city.name}
              </h2>
              <p className="mt-4 text-[13px] leading-relaxed text-white/40">
                {city.tagline}
              </p>
              <p
                className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] transition-colors group-hover:opacity-100 opacity-60"
                style={{ color: city.theme.accent }}
              >
                Explore →
              </p>
            </div>
            {/* Subtle accent bar at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 transition-opacity group-hover:opacity-100"
              style={{ backgroundColor: city.theme.accent }}
            />
          </Link>
        ))}
      </div>

      <p className="mt-16 text-[10px] font-semibold uppercase tracking-[0.5em] text-stone-800">
        {new Date().getFullYear()} · {siteConfig.name}
      </p>
    </div>
  );
}
