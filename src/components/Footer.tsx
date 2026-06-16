import Link from "next/link";
import { city, siteConfig } from "@/config/city";

export function Footer() {
  return (
    <footer className="mt-auto bg-stone-950 text-stone-400">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10">
        {/* Editorial ornament */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-[#9e7040]/20" />
          <span className="font-display text-xl italic text-[#9e7040]/40">✦</span>
          <div className="h-px flex-1 bg-[#9e7040]/20" />
        </div>

        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <p className="font-display text-3xl italic font-bold text-white">{siteConfig.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-stone-500">
              {siteConfig.tagline}
            </p>
            <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.5em] text-stone-700">
              {city.name}, {city.state}
            </p>
          </div>
          <nav className="flex flex-col gap-3 text-sm">
            <p className="text-[9px] font-semibold uppercase tracking-[0.5em] text-[#9e7040] mb-1">
              Explore
            </p>
            <Link href="/articles" className="transition-colors hover:text-white">Articles</Link>
            <Link href="/search?group=food" className="transition-colors hover:text-white">Restaurants</Link>
            <Link href="/search?group=golf" className="transition-colors hover:text-white">Golf</Link>
          </nav>
        </div>

        <div className="mt-12 border-t border-stone-800/50 pt-5 flex items-center justify-between">
          <p className="text-xs text-stone-700 tracking-wide">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="text-xs text-stone-700">Worcester, MA</p>
        </div>
      </div>
    </footer>
  );
}
