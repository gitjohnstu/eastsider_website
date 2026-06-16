import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCity } from "@/config/city";
import { ArticleCard } from "@/components/ArticleCard";
import { getPublishedArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

interface ArticlesPageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const { city } = await params;
  const cityConfig = getCity(city);
  return {
    title: "Articles",
    description: `Browse articles about ${cityConfig?.name ?? city} restaurants, bars, and things to do.`,
  };
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { city } = await params;
  const cityConfig = getCity(city);
  if (!cityConfig) notFound();

  const articles = await getPublishedArticles(cityConfig.slug);

  return (
    <div>
      <div className="border-b" style={{ backgroundColor: cityConfig.theme.mastheadBg, borderColor: cityConfig.theme.border }}>
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-14">
          <p className="text-[9px] font-semibold uppercase tracking-[0.55em]" style={{ color: cityConfig.theme.accent + "b3" }}>
            {cityConfig.name}, {cityConfig.state}
          </p>
          <h1 className="mt-4 font-display text-6xl italic font-bold tracking-tight text-[#0f0c0a]">
            Articles
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-500">
            Local stories and guides across {cityConfig.name} — restaurants, neighborhoods, and weekend ideas.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14">
        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} citySlug={city} />
            ))}
          </div>
        ) : (
          <p className="text-stone-500">No published articles yet.</p>
        )}
      </div>
    </div>
  );
}
