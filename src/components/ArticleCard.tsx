import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { ArticleWithPlace } from "@/lib/queries";

interface ArticleCardProps {
  article: ArticleWithPlace;
  featured?: boolean;
  citySlug?: string;
}

export function ArticleCard({ article, featured = false, citySlug }: ArticleCardProps) {
  const href = citySlug ? `/${citySlug}/articles/${article.slug}` : `/articles/${article.slug}`;
  if (featured) {
    return (
      <Link
        href={href}
        className="group relative flex overflow-hidden rounded-sm"
        style={{ aspectRatio: "16/9" }}
      >
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-900 flex items-center justify-center">
            <span className="font-display text-9xl italic font-bold text-white/10">E</span>
          </div>
        )}
        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
        {/* Content */}
        <div className="relative mt-auto p-7 sm:p-9">
          {article.place && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#c49040]">
              {article.place.name}
            </p>
          )}
          <h2 className="mt-2 font-display text-3xl italic font-bold leading-snug text-white sm:text-4xl">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="mt-3 text-sm leading-relaxed text-white/60 line-clamp-2 max-w-xl">
              {article.excerpt}
            </p>
          )}
          <div className="mt-5 flex items-center gap-3">
            <span className="text-xs text-white/40 tracking-wide">{formatDate(article.publishedAt)}</span>
            <span className="text-white/25">·</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c49040] transition-colors group-hover:text-[#e0b870]">
              Read story →
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-sm border border-[#dbd3c5] bg-white transition-colors hover:border-[#9e7040]/35"
    >
      <div className="relative overflow-hidden bg-[#ede5d8] aspect-[16/10]">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display italic text-4xl font-bold text-[#ccc4b8]">E</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {article.place && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9e7040]">
            {article.place.name}
          </p>
        )}
        <h2 className="mt-2 font-display text-xl italic font-bold leading-snug text-[#0f0c0a] transition-colors group-hover:text-[#9e7040]">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="mt-2 text-sm leading-relaxed text-stone-500 line-clamp-2">
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
