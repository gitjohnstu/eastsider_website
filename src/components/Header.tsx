import Link from "next/link";
import { siteConfig } from "@/config/city";
import { SearchBar } from "@/components/SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-stone-950 border-b border-[#9e7040]/20">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-4 py-4">
        <Link href="/" className="group shrink-0">
          <span className="font-display text-[22px] italic font-bold tracking-tight text-white transition-colors group-hover:text-[#c49040]">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center gap-7 text-[11px] tracking-[0.12em] uppercase text-stone-500">
          <Link href="/articles" className="nav-link transition-colors hover:text-white">
            Articles
          </Link>
          <Link href="/search?group=food" className="nav-link transition-colors hover:text-white">
            Restaurants
          </Link>
          <Link href="/search?group=golf" className="nav-link transition-colors hover:text-white">
            Golf
          </Link>
        </nav>

        <div className="ml-auto w-full max-w-xs">
          <SearchBar compact dark />
        </div>
      </div>
    </header>
  );
}
