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
      <div className="border-b border-[#dbd3c5] bg-[#f5efe6]">
        <div className="mx-auto max-w-3xl px-4 py-16">
          {article.place && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#9e7040]">
              {article.place.name}
            </p>
          )}
          <h1 className="mt-4 font-display text-4xl italic font-bold leading-tight text-[#0f0c0a] sm:text-5xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-stone-500">
              {article.excerpt}
            </p>
          )}
          <p className="mt-6 text-xs tracking-widest text-stone-400 uppercase">
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
