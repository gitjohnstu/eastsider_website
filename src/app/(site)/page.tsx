import Link from "next/link";
import { city, siteConfig } from "@/config/city";
import { ArticleCard } from "@/components/ArticleCard";
import { SearchBar } from "@/components/SearchBar";
import { getPublishedArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articles = await getPublishedArticles(6);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-stone-200 bg-[#faf7ef]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-32">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-amber-700">
            {city.name}, {city.state}
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-bold leading-[1.08] tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-stone-500">
            Read local stories about Worcester restaurants, bars, parks, and
            places worth your weekend — then search everything in one place.
          </p>
          <div className="mt-9 max-w-lg">
            <SearchBar />
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              href="/search?type=places&category=RESTAURANT"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-700 hover:text-amber-800"
            >
              Restaurants
            </Link>
            <Link
              href="/search?type=places&category=ATTRACTION"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-700 hover:text-amber-800"
            >
              Things to Do
            </Link>
            <Link
              href="/search?type=places&category=PARK"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-700 hover:text-amber-800"
            >
              Parks
            </Link>
            <Link
              href="/articles"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-700 hover:text-amber-800"
            >
              All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="flex items-baseline justify-between gap-4 border-b border-stone-900 pb-4">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-950">
            Latest from Worcester
          </h2>
          <Link
            href="/articles"
            className="text-xs font-semibold uppercase tracking-wider text-amber-800 transition hover:text-amber-700"
          >
            View all →
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
            No published articles yet. Seed the database or publish from the admin.
          </div>
        )}
      </section>
    </div>
  );
}
