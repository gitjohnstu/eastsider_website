"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface SearchBarProps {
  compact?: boolean;
  dark?: boolean;
  defaultQuery?: string;
}

export function SearchBar({ compact = false, dark = false, defaultQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={compact ? "Search Worcester…" : "Search restaurants, parks, articles…"}
        className={
          dark
            ? "w-full rounded-full border border-stone-700 bg-stone-900 px-4 py-2 text-sm text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            : "w-full rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-100"
        }
      />
      <button
        type="submit"
        className={
          dark
            ? "rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
            : "rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
        }
      >
        Search
      </button>
    </form>
  );
}
