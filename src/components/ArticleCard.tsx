import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { ArticleWithPlace } from "@/lib/queries";

interface ArticleCardProps {
  article: ArticleWithPlace;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_28px_rgba(0,0,0,0.09)]"
    >
      <div className={`relative overflow-hidden bg-stone-100 ${featured ? "aspect-[16/7]" : "aspect-[16/10]"}`}>
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#f0ece3]">
            <span className="font-serif italic text-2xl font-bold text-[#ccc4b8]">
              Eastsider
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {article.place && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9e7040]">
            {article.place.name}
          </p>
        )}
        <h2 className={`mt-2 font-serif font-bold leading-snug text-[#161210] transition-colors group-hover:text-[#9e7040] ${featured ? "text-3xl" : "text-xl"}`}>
          {article.title}
        </h2>
        {article.excerpt && (
          <p className={`mt-2 text-sm leading-relaxed text-stone-500 ${featured ? "" : "line-clamp-2"}`}>
            {article.excerpt}
          </p>
        )}
        <p className="mt-auto pt-5 text-xs tracking-wide text-stone-400">
          {formatDate(article.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
