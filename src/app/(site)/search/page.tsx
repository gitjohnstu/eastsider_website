import type { Metadata } from "next";
import { city, navGroups } from "@/config/city";
import type { NavGroupKey } from "@/config/city";
import { SearchClient } from "@/components/SearchClient";
import type { PlaceCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    group?: NavGroupKey;
    category?: PlaceCategory;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { group } = await searchParams;
  const label = group && group in navGroups ? navGroups[group as NavGroupKey].label : "Search";
  return {
    title: label,
    description: `${label} in ${city.name}, ${city.state}.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const group = params.group && params.group in navGroups ? params.group : undefined;
  const category = params.category;
  const groupDef = group ? navGroups[group] : null;

  const heading = groupDef?.label ?? "Search";

  return (
    <div>
      <div className="bg-[#f5efe6] border-b border-[#dbd3c5]">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-14">
          <p className="text-[9px] font-semibold uppercase tracking-[0.55em] text-[#9e7040]/70">
            {city.name}, {city.state}
          </p>
          <h1 className="mt-4 font-display text-6xl italic font-bold tracking-tight text-[#0f0c0a]">
            {heading}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <SearchClient
          initialQuery={query}
          initialGroup={group as NavGroupKey | undefined}
          initialCategory={category}
        />
      </div>
    </div>
  );
}
