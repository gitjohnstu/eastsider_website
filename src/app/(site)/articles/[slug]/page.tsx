import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { PlaceCard } from "@/components/PlaceCard";
import { siteConfig } from "@/config/city";
import { getArticleBySlug } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "PUBLISHED") {
    return { title: "Article not found" };
  }

  return {
    title: article.title,
    description: article.excerpt ?? siteConfig.description,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <article>
      {/* Article header */}
      <div className="border-b border-stone-200 bg-[#faf7ef]">
        <div className="mx-auto max-w-3xl px-4 py-16">
          {article.place && (
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-700">
              {article.place.name}
            </p>
          )}
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-stone-950 sm:text-5xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-5 text-xl leading-relaxed text-stone-500">
              {article.excerpt}
            </p>
          )}
          <p className="mt-5 text-sm text-stone-400">
            Published {formatDate(article.publishedAt)}
          </p>
        </div>
      </div>

      {article.coverImage && (
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="relative aspect-[21/9] overflow-hidden rounded-xl bg-stone-200">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-4 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <MarkdownContent content={article.body} />
        {article.place && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <PlaceCard place={article.place} />
          </aside>
        )}
      </div>
    </article>
  );
}
