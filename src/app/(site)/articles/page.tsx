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
      <div className="bg-[#f6f2ea] border-b border-[#e3dcd4]">
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-16">
          <div className="mb-7 h-px w-14 bg-[#9e7040]" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-[#9e7040]">
            Worcester, MA
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold tracking-tight text-[#161210]">
            Articles
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-500">
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
