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
    <div className="flex flex-col border border-[#dbd3c5] bg-white rounded-sm p-7 transition-colors hover:border-[#9e7040]/35">
      {/* Date header */}
      <div className="flex items-end gap-3 pb-5 border-b border-[#dbd3c5]">
        <span className="font-display text-6xl font-bold leading-none text-[#9e7040] italic">
          {day}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9e7040]/60 pb-1">
          {month}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col mt-5 min-w-0">
        {event.place && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9e7040]">
            {event.place.name}
          </p>
        )}
        <h3 className="mt-1.5 font-display text-xl italic font-bold leading-snug text-[#0f0c0a]">
          {event.title}
        </h3>
        <p className="mt-2 text-xs text-stone-400 tracking-wide">
          {time}{endTime ? ` – ${endTime}` : ""}
        </p>
        {(event.location ?? event.place?.address) && (
          <p className="mt-0.5 text-xs text-stone-400 truncate">
            {event.location ?? event.place?.address}
          </p>
        )}
        {event.description && (
          <p className="mt-3 text-sm leading-relaxed text-stone-500 line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
