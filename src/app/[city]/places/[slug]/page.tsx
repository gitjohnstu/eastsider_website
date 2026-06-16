import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCity, siteConfig } from "@/config/city";
import { PlaceCard } from "@/components/PlaceCard";
import { getPlaceBySlug } from "@/lib/queries";
import { categoryLabel, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PlacePageProps {
  params: Promise<{ city: string; slug: string }>;
}

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const cityConfig = getCity(city);
  const place = await getPlaceBySlug(slug);

  if (!place) return { title: "Place not found" };

  return {
    title: place.name,
    description: `${place.name} in ${cityConfig?.name ?? city} — ${place.address}`,
    openGraph: {
      title: place.name,
      description: `${categoryLabel(place.category)} in ${cityConfig?.name ?? city}`,
    },
  };
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { city, slug } = await params;
  const cityConfig = getCity(city);
  if (!cityConfig) notFound();

  const place = await getPlaceBySlug(slug);
  if (!place) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]">
        <PlaceCard place={place} />
        <div>
          <h1 className="font-display text-4xl italic font-bold text-[#0f0c0a]">{place.name}</h1>
          <p className="mt-3 text-base text-stone-500">
            {categoryLabel(place.category)} · {cityConfig.name}, {cityConfig.state}
          </p>

          <section className="mt-10">
            <h2 className="font-display text-2xl italic font-bold text-[#0f0c0a]">
              Articles about {place.name}
            </h2>
            {place.articles.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {place.articles.map((article) => (
                  <li key={article.id} className="rounded-sm border border-[#dbd3c5] bg-white p-5">
                    <Link
                      href={`/${city}/articles/${article.slug}`}
                      className="font-display text-xl italic font-bold text-[#0f0c0a] transition hover:text-[#9e7040]"
                    >
                      {article.title}
                    </Link>
                    {article.excerpt && (
                      <p className="mt-2 text-sm text-stone-500">{article.excerpt}</p>
                    )}
                    <p className="mt-2 text-xs text-stone-400">{formatDate(article.publishedAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-stone-500">
                No articles yet — check back soon on {siteConfig.name}.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
