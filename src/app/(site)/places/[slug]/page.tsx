import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceCard } from "@/components/PlaceCard";
import { siteConfig } from "@/config/city";
import { getPlaceBySlug } from "@/lib/queries";
import { categoryLabel, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PlacePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PlacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place) return { title: "Place not found" };

  return {
    title: place.name,
    description: `${place.name} in Worcester, MA — ${place.address}`,
    openGraph: {
      title: place.name,
      description: `${categoryLabel(place.category)} in Worcester, MA`,
    },
  };
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]">
        <PlaceCard place={place} />
        <div>
          <h1 className="font-serif text-4xl font-bold text-stone-900">{place.name}</h1>
          <p className="mt-3 text-lg text-stone-600">
            {categoryLabel(place.category)} in Worcester, MA
          </p>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Articles about {place.name}
            </h2>
            {place.articles.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {place.articles.map((article) => (
                  <li
                    key={article.id}
                    className="rounded-xl border border-stone-200 bg-white p-5"
                  >
                    <Link
                      href={`/articles/${article.slug}`}
                      className="font-serif text-xl font-bold text-stone-900 hover:text-amber-900"
                    >
                      {article.title}
                    </Link>
                    {article.excerpt && (
                      <p className="mt-2 text-sm text-stone-600">{article.excerpt}</p>
                    )}
                    <p className="mt-2 text-xs text-stone-500">
                      {formatDate(article.publishedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-stone-600">
                No articles yet — check back soon on {siteConfig.name}.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
