import Link from "next/link";
import { siteConfig } from "@/config/city";

export function Footer() {
  return (
    <footer className="mt-auto bg-stone-950 text-stone-400">
      <div className="mx-auto max-w-6xl px-4 pt-1 pb-14">
        <div className="mb-12 h-px w-16 bg-[#9e7040]" />
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <p className="font-serif text-2xl italic font-bold text-white">{siteConfig.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-stone-500">
              {siteConfig.tagline}
            </p>
          </div>
          <nav className="flex flex-col gap-3 text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9e7040]">
              Explore
            </p>
            <Link href="/articles" className="transition-colors hover:text-white">Articles</Link>
            <Link href="/search?group=food" className="transition-colors hover:text-white">Restaurants</Link>
            <Link href="/search?group=golf" className="transition-colors hover:text-white">Golf</Link>
          </nav>
        </div>
        <div className="mt-14 border-t border-stone-800/60 pt-6">
          <p className="text-xs text-stone-600 tracking-wide">
            © {new Date().getFullYear()} {siteConfig.name} — Worcester, MA
          </p>
        </div>
      </div>
    </footer>
  );
}
