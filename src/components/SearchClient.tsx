"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navGroups } from "@/config/city";
import type { NavGroupKey } from "@/config/city";
import { categoryLabel } from "@/lib/utils";
import type { SearchResult } from "@/lib/search";
import type { PlaceCategory } from "@prisma/client";

interface SearchClientProps {
  initialQuery: string;
  initialGroup?: NavGroupKey;
  initialCategory?: PlaceCategory;
}

export function SearchClient({ initialQuery, initialGroup, initialCategory }: SearchClientProps) {
  const router = useRouter();
  const group = initialGroup;
  const groupDef = group ? navGroups[group] : null;

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<PlaceCategory | undefined>(initialCategory);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    // Group pages show results even with no query; general search requires a query
    if (!trimmed && !group) {
      setResults([]);
      return;
    }

    const delay = !trimmed && group ? 0 : 250;

    const timer = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (trimmed) params.set("q", trimmed);
        if (group) params.set("group", group);
        if (category) params.set("category", category);

        const res = await fetch(`/api/search?${params}`, {
          signal: abortRef.current.signal,
        });
        const data = (await res.json()) as SearchResult[];
        setResults(data);

        // Sync URL
        const urlParams = new URLSearchParams();
        if (trimmed) urlParams.set("q", trimmed);
        if (group) urlParams.set("group", group);
        if (category) urlParams.set("category", category);
        router.replace(`/search?${urlParams}`, { scroll: false });
      } catch (err) {
        if ((err as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, group, category, router]);

  function toggleCategory(val: PlaceCategory) {
    setCategory((prev) => (prev === val ? undefined : val));
  }

  return (
    <>
      {/* Search input */}
      <div className="max-w-xl">
        <div className="flex w-full gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              groupDef
                ? `Search ${groupDef.label.toLowerCase()}…`
                : "Search restaurants, parks, articles…"
            }
            autoFocus={!group}
            className="w-full rounded border border-[#e3dcd4] bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#9e7040] focus:outline-none focus:ring-2 focus:ring-[#9e7040]/10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded border border-[#e3dcd4] bg-white px-4 py-2.5 text-sm font-medium text-stone-500 transition hover:border-stone-400 hover:text-stone-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Sub-category filters (only shown inside a group) */}
      {groupDef && groupDef.subFilters.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {groupDef.subFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => toggleCategory(f.value as PlaceCategory)}
              className={`rounded px-4 py-2 text-sm font-medium transition ${
                category === f.value
                  ? "bg-[#161210] text-white"
                  : "border border-[#e3dcd4] bg-white text-stone-700 hover:border-stone-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="mt-10">
        {loading ? (
          <p className="text-sm text-stone-400">Searching…</p>
        ) : !query.trim() && !group ? (
          <p className="text-stone-500">Start typing to see results.</p>
        ) : results.length === 0 ? (
          <p className="text-stone-500">
            {query.trim()
              ? `No results for "${query}" in Worcester.`
              : `No ${groupDef?.label.toLowerCase() ?? "places"} found yet.`}
          </p>
        ) : (
          <ul className="divide-y divide-[#e3dcd4] rounded-sm border border-[#e3dcd4] bg-white overflow-hidden">
            {results.map((result) => (
              <li
                key={`${result.type}-${result.id}`}
                className="px-7 py-6 transition hover:bg-[#faf8f4]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9e7040]">
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
                  className="mt-1.5 block font-serif text-2xl font-bold text-[#161210] transition hover:text-[#9e7040]"
                >
                  {result.title}
                </Link>
                {result.excerpt && (
                  <p className="mt-2 text-sm text-stone-500">{result.excerpt}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
