import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { ArticleWithPlace } from "@/lib/queries";

interface ArticleCardProps {
  article: ArticleWithPlace;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-stone-100">
            <span className="font-serif text-2xl font-bold text-stone-300">
              Eastsider
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {article.place && (
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
            {article.place.name}
          </p>
        )}
        <h2 className="mt-1.5 font-serif text-xl font-bold leading-snug text-stone-950 transition-colors group-hover:text-amber-900">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-500">
            {article.excerpt}
          </p>
        )}
        <p className="mt-auto pt-4 text-xs text-stone-400">
          {formatDate(article.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
