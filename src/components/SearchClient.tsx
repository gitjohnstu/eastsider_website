"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NavGroupKey } from "@/config/city";
import { categoryLabel } from "@/lib/utils";
import type { SearchResult } from "@/lib/search";
import type { PlaceCategory } from "@prisma/client";

type NavGroupDef = {
  label: string;
  categories: readonly string[];
  subFilters: readonly { value: string; label: string }[];
};

interface SearchClientProps {
  initialQuery: string;
  initialGroup?: NavGroupKey;
  initialCategory?: PlaceCategory;
  citySlug: string;
  cityName: string;
  cityNavGroups: Record<string, NavGroupDef>;
}

export function SearchClient({
  initialQuery,
  initialGroup,
  initialCategory,
  citySlug,
  cityName,
  cityNavGroups,
}: SearchClientProps) {
  const router = useRouter();
  const group = initialGroup;
  const groupDef: NavGroupDef | null = group && group in cityNavGroups ? cityNavGroups[group] : null;

  const [query, setQuery] = useState(initialQuery);
  const validInitialCategory =
    initialCategory && groupDef
      ? (groupDef.categories as readonly string[]).includes(initialCategory)
        ? initialCategory
        : undefined
      : initialCategory;
  const [category, setCategory] = useState<PlaceCategory | undefined>(validInitialCategory);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncVersion, setSyncVersion] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!group) return;
    setSyncing(true);
    fetch(`/api/places/sync?group=${group}&city=${citySlug}`)
      .then((r) => r.json())
      .then((data: { synced?: number; cached?: boolean }) => {
        if (data.synced && data.synced > 0) setSyncVersion((v) => v + 1);
      })
      .catch(() => {/* non-fatal */})
      .finally(() => setSyncing(false));
  }, [group, citySlug]);

  useEffect(() => {
    const trimmed = query.trim();

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
        params.set("city", citySlug);

        const res = await fetch(`/api/search?${params}`, {
          signal: abortRef.current.signal,
        });
        const data = (await res.json()) as SearchResult[];
        setResults(data);

        const urlParams = new URLSearchParams();
        if (trimmed) urlParams.set("q", trimmed);
        if (group) urlParams.set("group", group);
        if (category) urlParams.set("category", category);
        router.replace(`/${citySlug}/search?${urlParams}`, { scroll: false });
      } catch (err) {
        if ((err as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, group, category, router, syncVersion, citySlug]);

  function toggleCategory(val: PlaceCategory) {
    setCategory((prev) => (prev === val ? undefined : val));
  }

  return (
    <>
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

      <div className="mt-10">
        {loading ? (
          <p className="text-sm text-stone-400">Searching…</p>
        ) : syncing && results.length === 0 ? (
          <p className="text-sm text-stone-400">Finding {cityName} places…</p>
        ) : !query.trim() && !group ? (
          <p className="text-stone-500">Start typing to see results.</p>
        ) : results.length === 0 ? (
          <p className="text-stone-500">
            {query.trim()
              ? `No results for "${query}" in ${cityName}.`
              : `No ${groupDef?.label.toLowerCase() ?? "places"} found yet.`}
          </p>
        ) : (
          <ul className="divide-y divide-[#dbd3c5] rounded-sm border border-[#dbd3c5] bg-white overflow-hidden">
            {results.map((result) => (
              <li
                key={`${result.type}-${result.id}`}
                className="px-7 py-6 transition hover:bg-[#faf8f4]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9e7040]">
                  {result.type === "article"
                    ? "Article"
                    : categoryLabel(result.category ?? "OTHER")}
                </p>
                <Link
                  href={
                    result.type === "article"
                      ? `/${citySlug}/articles/${result.slug}`
                      : `/${citySlug}/places/${result.slug}`
                  }
                  className="mt-1.5 block font-display text-2xl italic font-bold text-[#0f0c0a] transition hover:text-[#9e7040]"
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
