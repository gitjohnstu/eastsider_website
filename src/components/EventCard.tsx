import type { EventWithPlace } from "@/lib/queries";

interface EventCardProps {
  event: EventWithPlace;
}

export function EventCard({ event }: EventCardProps) {
  const start = new Date(event.startDate);
  const day = start.toLocaleDateString("en-US", { day: "numeric" });
  const month = start.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const time = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const hasEnd = event.endDate != null;
  const endTime = hasEnd
    ? new Date(event.endDate!).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : null;

  return (
    <div className="flex gap-5 rounded-sm bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
      {/* Date column */}
      <div className="flex shrink-0 flex-col items-center justify-start pt-1 w-14 text-center">
        <span className="font-serif text-4xl font-bold leading-none text-[#9e7040]">{day}</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9e7040]">{month}</span>
      </div>

      {/* Divider */}
      <div className="w-px self-stretch bg-[#e3dcd4]" />

      {/* Content column */}
      <div className="flex flex-col min-w-0">
        {event.place && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9e7040]">
            {event.place.name}
          </p>
        )}
        <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-[#161210]">
          {event.title}
        </h3>
        <p className="mt-1.5 text-xs text-stone-500">
          {time}{endTime ? ` – ${endTime}` : ""}
        </p>
        {(event.location ?? event.place?.address) && (
          <p className="mt-1 text-xs text-stone-500 truncate">
            {event.location ?? event.place?.address}
          </p>
        )}
        {event.description && (
          <p className="mt-2 text-sm leading-relaxed text-stone-500 line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
