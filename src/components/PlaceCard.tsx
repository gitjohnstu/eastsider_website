import Link from "next/link";
import { categoryLabel } from "@/lib/utils";
import type { Place } from "@prisma/client";

interface PlaceCardProps {
  place: Place;
  compact?: boolean;
}

export function PlaceCard({ place, compact = false }: PlaceCardProps) {
  const hours = place.hours as { weekdayDescriptions?: string[] } | null;

  return (
    <div
      className={`rounded-xl border border-stone-200 bg-white ${compact ? "p-4" : "p-6"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
            {categoryLabel(place.category)}
            {place.neighborhood ? ` · ${place.neighborhood}` : ""}
          </p>
          <h3 className="mt-1 font-serif text-xl font-bold text-stone-950">
            {compact ? (
              <Link href={`/places/${place.slug}`} className="transition-colors hover:text-amber-900">
                {place.name}
              </Link>
            ) : (
              place.name
            )}
          </h3>
        </div>
        {place.rating && (
          <span className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-sm font-semibold text-stone-700">
            ★ {place.rating.toFixed(1)}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-stone-500">{place.address}</p>

      {hours?.weekdayDescriptions && !compact && (
        <ul className="mt-3 space-y-1 text-sm text-stone-500">
          {hours.weekdayDescriptions.slice(0, 3).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
        >
          Get directions
        </a>
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400"
          >
            Website
          </a>
        )}
        {!compact && (
          <Link
            href={`/places/${place.slug}`}
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400"
          >
            View place
          </Link>
        )}
      </div>

      {!compact && (
        <div className="mt-5 overflow-hidden rounded-xl border border-stone-200">
          <iframe
            title={`Map of ${place.name}`}
            src={`https://maps.google.com/maps?q=${place.lat},${place.lng}&z=15&output=embed`}
            className="h-48 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  );
}
