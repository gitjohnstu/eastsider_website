import Link from "next/link";
import { siteConfig } from "@/config/city";

export function Footer() {
  return (
    <footer className="mt-auto bg-stone-950 text-stone-400">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <p className="font-serif text-2xl font-bold text-white">{siteConfig.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-400">
              {siteConfig.tagline}
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-10 gap-y-3 text-sm font-medium">
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-stone-600">
                Explore
              </p>
              <Link href="/articles" className="transition-colors hover:text-white">Articles</Link>
              <Link href="/search?type=places&category=RESTAURANT" className="transition-colors hover:text-white">Restaurants</Link>
              <Link href="/search?type=places&category=BAR" className="transition-colors hover:text-white">Bars</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-stone-600">
                &nbsp;
              </p>
              <Link href="/search?type=places&category=ATTRACTION" className="transition-colors hover:text-white">Things to Do</Link>
              <Link href="/search?type=places&category=PARK" className="transition-colors hover:text-white">Parks</Link>
              <Link href="/search?type=places&category=MUSEUM" className="transition-colors hover:text-white">Museums</Link>
            </div>
          </nav>
        </div>
        <div className="mt-12 border-t border-stone-800 pt-6">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} {siteConfig.name} — Worcester, MA
          </p>
        </div>
      </div>
    </footer>
  );
}
