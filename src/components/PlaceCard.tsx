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
      className={`rounded-sm border border-[#dbd3c5] bg-white transition-colors hover:border-[#9e7040]/35 ${compact ? "p-5" : "p-7"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9e7040]">
            {categoryLabel(place.category)}
            {place.neighborhood ? ` · ${place.neighborhood}` : ""}
          </p>
          <h3 className="mt-1.5 font-display text-xl italic font-bold text-[#0f0c0a]">
            {compact ? (
              <Link href={`/places/${place.slug}`} className="transition-colors hover:text-[#9e7040]">
                {place.name}
              </Link>
            ) : (
              place.name
            )}
          </h3>
        </div>
        {place.rating && (
          <span className="shrink-0 rounded border border-[#dbd3c5] bg-[#f5efe6] px-2.5 py-1 text-sm font-semibold text-stone-600">
            ★ {place.rating.toFixed(1)}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-stone-500">{place.address}</p>

      {hours?.weekdayDescriptions && !compact && (
        <ul className="mt-4 space-y-1 text-sm text-stone-500 border-l-2 border-[#dbd3c5] pl-4">
          {hours.weekdayDescriptions.slice(0, 3).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-[#9e7040] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b07838]"
        >
          Get directions
        </a>
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-[#dbd3c5] bg-white px-4 py-2 text-sm font-medium text-stone-600 transition hover:border-stone-400"
          >
            Website
          </a>
        )}
        {!compact && (
          <Link
            href={`/places/${place.slug}`}
            className="rounded border border-[#dbd3c5] bg-white px-4 py-2 text-sm font-medium text-stone-600 transition hover:border-stone-400"
          >
            View place
          </Link>
        )}
      </div>

      {!compact && (
        <div className="mt-6 overflow-hidden rounded border border-[#dbd3c5]">
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
