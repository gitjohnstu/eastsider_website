import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCity, allNavGroups, getCityNavGroups } from "@/config/city";
import type { NavGroupKey } from "@/config/city";
import { SearchClient } from "@/components/SearchClient";
import type { PlaceCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  params: Promise<{ city: string }>;
  searchParams: Promise<{
    q?: string;
    group?: NavGroupKey;
    category?: PlaceCategory;
  }>;
}

export async function generateMetadata({ params, searchParams }: SearchPageProps): Promise<Metadata> {
  const { city } = await params;
  const { group } = await searchParams;
  const cityConfig = getCity(city);
  const label = group && group in allNavGroups ? allNavGroups[group as NavGroupKey].label : "Search";
  return {
    title: label,
    description: `${label} in ${cityConfig?.name ?? city}.`,
  };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { city } = await params;
  const cityConfig = getCity(city);
  if (!cityConfig) notFound();

  const sp = await searchParams;
  const query = sp.q?.trim() ?? "";

  // Only allow groups that belong to this city
  const cityNavGroups = getCityNavGroups(cityConfig.navGroupKeys);
  const group = sp.group && sp.group in cityNavGroups ? sp.group : undefined;
  const category = sp.category;

  const groupLabel = group ? allNavGroups[group].label : "Search";

  return (
    <div>
      <div className="border-b" style={{ backgroundColor: cityConfig.theme.mastheadBg, borderColor: cityConfig.theme.border }}>
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-14">
          <p className="text-[9px] font-semibold uppercase tracking-[0.55em]" style={{ color: cityConfig.theme.accent + "b3" }}>
            {cityConfig.name}, {cityConfig.state}
          </p>
          <h1 className="mt-4 font-display text-4xl italic font-bold tracking-tight text-[#0f0c0a] sm:text-6xl">
            {groupLabel}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <SearchClient
          initialQuery={query}
          initialGroup={group}
          initialCategory={category}
          citySlug={cityConfig.slug}
          cityName={cityConfig.name}
          cityNavGroups={cityNavGroups}
        />
      </div>
    </div>
  );
}
