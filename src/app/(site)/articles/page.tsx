import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { getPublishedArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles",
  description: "Browse articles about Worcester restaurants, bars, parks, and things to do.",
};

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <div>
      <div className="bg-[#f5efe6] border-b border-[#dbd3c5]">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-14">
          <p className="text-[9px] font-semibold uppercase tracking-[0.55em] text-[#9e7040]/70">
            Worcester, MA
          </p>
          <h1 className="mt-4 font-display text-6xl italic font-bold tracking-tight text-[#0f0c0a]">
            Articles
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-500">
            Local stories and guides across Worcester — restaurants, neighborhoods,
            museums, and weekend ideas.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14">
        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-stone-500">No published articles yet.</p>
        )}
      </div>
    </div>
  );
}
