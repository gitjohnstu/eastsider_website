import Link from "next/link";
import { siteConfig } from "@/config/city";
import { SearchBar } from "@/components/SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3.5">
        <Link href="/" className="group shrink-0">
          <span className="font-serif text-xl font-bold tracking-tight text-white transition-colors group-hover:text-amber-300">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm font-medium text-stone-400">
          <Link href="/articles" className="transition-colors hover:text-white">
            Articles
          </Link>
          <Link
            href="/search?type=places&category=RESTAURANT"
            className="transition-colors hover:text-white"
          >
            Restaurants
          </Link>
          <Link
            href="/search?type=places&category=ATTRACTION"
            className="transition-colors hover:text-white"
          >
            Things to Do
          </Link>
          <Link
            href="/search?type=places&category=PARK"
            className="transition-colors hover:text-white"
          >
            Parks
          </Link>
        </nav>

        <div className="ml-auto w-full max-w-xs">
          <SearchBar compact dark />
        </div>
      </div>
    </header>
  );
}
