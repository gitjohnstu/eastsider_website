import type { Metadata } from "next";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { city, placeCategories } from "@/config/city";
import { searchCity, type SearchType } from "@/lib/search";
import { categoryLabel } from "@/lib/utils";
import type { PlaceCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: SearchType;
    category?: PlaceCategory;
  }>;
}

export const metadata: Metadata = {
  title: "Search",
  description: `Search restaurants, places, and articles in ${city.name}, ${city.state}.`,
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const type = params.type ?? "all";
  const category = params.category;

  const results = query
    ? await searchCity(query, { type, category })
    : [];

  function buildHref(overrides: Record<string, string | undefined>) {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    next.set("type", overrides.type ?? type);
    if (overrides.category ?? category) {
      const cat = overrides.category ?? category;
      if (cat) next.set("category", cat);
    }
    return `/search?${next.toString()}`;
  }

  return (
    <div>
      <div className="border-b border-stone-200 bg-[#faf7ef]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-amber-700">
            {city.name}, {city.state}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold tracking-tight text-stone-950">
            Search
          </h1>
          <div className="mt-6 max-w-xl">
            <SearchBar defaultQuery={query} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Type filters */}
        <div className="flex flex-wrap gap-2">
          {(["all", "articles", "places"] as SearchType[]).map((value) => (
            <Link
              key={value}
              href={buildHref({ type: value })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                type === value
                  ? "bg-stone-950 text-white"
                  : "border border-stone-300 bg-white text-stone-700 hover:border-stone-400"
              }`}
            >
              {value === "all" ? "All" : value === "articles" ? "Articles" : "Places"}
            </Link>
          ))}
        </div>

        {/* Category filters */}
        {type !== "articles" && (
          <div className="mt-3 flex flex-wrap gap-2">
            {placeCategories.map((cat) => (
              <Link
                key={cat.value}
                href={buildHref({ type: "places", category: cat.value })}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  category === cat.value
                    ? "bg-amber-800 text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:border-stone-400"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="mt-10">
          {!query ? (
            <p className="text-stone-500">Enter a search term to get started.</p>
          ) : results.length === 0 ? (
            <p className="text-stone-500">
              No results for &ldquo;{query}&rdquo; in Worcester.
            </p>
          ) : (
            <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white overflow-hidden">
              {results.map((result) => (
                <li
                  key={`${result.type}-${result.id}`}
                  className="px-6 py-5 transition hover:bg-stone-50"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
                    {result.type === "article"
                      ? "Article"
                      : categoryLabel(result.category ?? "OTHER")}
                  </p>
                  <Link
                    href={
                      result.type === "article"
                        ? `/articles/${result.slug}`
                        : `/places/${result.slug}`
                    }
                    className="mt-1 block font-serif text-2xl font-bold text-stone-950 transition hover:text-amber-900"
                  >
                    {result.title}
                  </Link>
                  {result.excerpt && (
                    <p className="mt-1.5 text-sm text-stone-500">{result.excerpt}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
