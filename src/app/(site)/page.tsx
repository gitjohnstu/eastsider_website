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
      {/* Compact masthead */}
      <section className="bg-[#f6f2ea] border-b border-[#e3dcd4]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="mb-5 h-px w-14 bg-[#9e7040]" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-[#9e7040]">
            {city.name}, {city.state}
          </p>
          <h1 className="mt-3 font-serif text-3xl italic font-bold tracking-tight text-[#161210] sm:text-4xl">
            {siteConfig.name}
          </h1>
          <p className="mt-2 text-sm text-stone-500 max-w-sm">
            {siteConfig.tagline}
          </p>
        </div>
      </section>

      {/* Latest articles */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-5">
            <div className="h-px w-10 bg-[#9e7040]" />
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#161210]">
              Latest from Worcester
            </h2>
          </div>
          <Link
            href="/articles"
            className="text-xs font-semibold uppercase tracking-wider text-[#9e7040] transition hover:text-[#b58248]"
          >
            View all →
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="space-y-6">
            {/* Featured + 2 stacked cards side by side on desktop */}
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
            {/* Remaining articles in a row below */}
            {rest.length > 2 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.slice(2).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded border border-dashed border-[#e3dcd4] bg-white p-10 text-center text-stone-500">
            No published articles yet.
          </div>
        )}
      </section>

      {/* Upcoming events — always shown */}
      <section className="border-t border-[#e3dcd4] bg-[#f6f2ea]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex items-center gap-5 mb-8">
            <div className="h-px w-10 bg-[#9e7040]" />
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#161210]">
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
