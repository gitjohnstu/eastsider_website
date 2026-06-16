import Link from "next/link";
import { city, siteConfig } from "@/config/city";
import { ArticleCard } from "@/components/ArticleCard";
import { EventCard } from "@/components/EventCard";
import { getPublishedArticles, getUpcomingEvents } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [articles, events] = await Promise.all([
    getPublishedArticles(5),
    getUpcomingEvents(3),
  ]);

  const [featured, ...rest] = articles;

  return (
    <div>
      {/* Editorial masthead */}
      <section className="bg-[#f5efe6] border-b border-[#dbd3c5]">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:pt-16 sm:pb-14">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[9px] font-semibold uppercase tracking-[0.55em] text-[#9e7040]/70">
              {city.name}, {city.state}
            </span>
            <span className="text-[9px] tracking-widest text-stone-400">
              {new Date().getFullYear()}
            </span>
          </div>
          <div className="h-[1.5px] w-full bg-[#dbd3c5]" />
          <h1 className="mt-6 font-display text-6xl italic font-bold tracking-[-0.02em] text-[#0f0c0a] leading-none sm:text-8xl">
            {siteConfig.name}
          </h1>
          <div className="mt-7 flex items-center gap-5">
            <div className="h-px flex-1 bg-[#9e7040]/20" />
            <p className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.55em] text-[#9e7040]">
              The Worcester Guide
            </p>
            <div className="h-px flex-1 bg-[#9e7040]/20" />
          </div>
        </div>
      </section>

      {/* Latest articles */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-9">
          <h2 className="font-display text-4xl italic font-bold text-[#0f0c0a]">
            Latest from Worcester
          </h2>
          <Link
            href="/articles"
            className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#9e7040] transition hover:text-[#b07838]"
          >
            All articles
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {featured && (
                <div className="lg:col-span-2">
                  <ArticleCard article={featured} featured />
                </div>
              )}
              {rest.length > 0 && (
                <div className="flex flex-col gap-6">
                  {rest.slice(0, 2).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>
            {rest.length > 2 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.slice(2).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-[#dbd3c5] bg-white p-10 text-center text-stone-500">
            No published articles yet.
          </div>
        )}
      </section>

      {/* Upcoming events — always shown */}
      <section className="border-t border-[#dbd3c5] bg-[#f5efe6]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="mb-9">
            <h2 className="font-display text-4xl italic font-bold text-[#0f0c0a]">
              Upcoming Events
            </h2>
          </div>
          {events.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">No upcoming events. Check back soon.</p>
          )}
        </div>
      </section>
    </div>
  );
}
