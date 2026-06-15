"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { Event, Place } from "@prisma/client";

interface EventFormProps {
  places: Place[];
  event?: Event;
}

function toDatetimeLocalValue(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function EventForm({ places, event }: EventFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [startDate, setStartDate] = useState(toDatetimeLocalValue(event?.startDate));
  const [endDate, setEndDate] = useState(toDatetimeLocalValue(event?.endDate));
  const [location, setLocation] = useState(event?.location ?? "");
  const [placeId, setPlaceId] = useState(event?.placeId ?? "");
  const [placeQuery, setPlaceQuery] = useState(
    event?.placeId ? (places.find((p) => p.id === event.placeId)?.name ?? "") : ""
  );
  const [isPublished, setIsPublished] = useState(event?.isPublished ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredPlaces = useMemo(() => {
    const q = placeQuery.trim().toLowerCase();
    if (!q) return places.slice(0, 10);
    return places
      .filter(
        (place) =>
          place.name.toLowerCase().includes(q) ||
          place.address.toLowerCase().includes(q),
      )
      .slice(0, 10);
  }, [placeQuery, places]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        event ? `/api/admin/events/${event.id}` : "/api/admin/events",
        {
          method: event ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description: description || null,
            startDate,
            endDate: endDate || null,
            location: location || null,
            placeId: placeId || null,
            isPublished,
          }),
        },
      );

      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Save failed");

      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-stone-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-700">Start date &amp; time <span className="text-red-500">*</span></label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">End date &amp; time (optional)</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Location (optional)</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Address or venue name"
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Linked place (optional)</label>
        <input
          value={placeQuery}
          onChange={(e) => {
            setPlaceQuery(e.target.value);
            if (!e.target.value) setPlaceId("");
          }}
          placeholder="Search places..."
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
        {filteredPlaces.length > 0 && (
          <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-stone-200">
            {filteredPlaces.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => {
                  setPlaceId(place.id);
                  setPlaceQuery(place.name);
                }}
                className={`block w-full border-b border-stone-100 px-3 py-2 text-left text-sm last:border-0 hover:bg-stone-50 ${
                  placeId === place.id ? "bg-amber-50" : ""
                }`}
              >
                <span className="font-medium">{place.name}</span>
                <span className="mt-0.5 block text-stone-500">{place.address}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="isPublished"
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-4 w-4 rounded border-stone-300 text-amber-800"
        />
        <label htmlFor="isPublished" className="text-sm font-medium text-stone-700">
          Published (visible on homepage)
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-amber-800 px-5 py-2 text-sm font-medium text-white hover:bg-amber-900 disabled:opacity-50"
      >
        {saving ? "Saving..." : event ? "Update event" : "Create event"}
      </button>
    </form>
  );
}
