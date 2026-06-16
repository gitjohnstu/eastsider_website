"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface SearchBarProps {
  compact?: boolean;
  dark?: boolean;
  defaultQuery?: string;
  citySlug?: string;
}

export function SearchBar({ compact = false, dark = false, defaultQuery = "", citySlug }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const base = citySlug ? `/${citySlug}/search` : "/search";
    router.push(`${base}?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={compact ? "Search…" : "Search restaurants, parks, articles…"}
        className={
          dark
            ? "w-full rounded border border-stone-700 bg-stone-900 px-4 py-2 text-sm text-stone-100 placeholder:text-stone-500 focus:border-[#9e7040] focus:outline-none focus:ring-1 focus:ring-[#9e7040]/30"
            : "w-full rounded border border-[#e3dcd4] bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#9e7040] focus:outline-none focus:ring-2 focus:ring-[#9e7040]/10"
        }
      />
      <button
        type="submit"
        className={
          dark
            ? "rounded bg-[#9e7040] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b58248]"
            : "rounded bg-[#161210] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
        }
      >
        Search
      </button>
    </form>
  );
}
