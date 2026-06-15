import Link from "next/link";
import { getAllEventsForAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await getAllEventsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Events</h1>
          <p className="mt-2 text-stone-600">Manage upcoming Worcester events shown on the homepage.</p>
        </div>
        <Link
          href="/admin/events/new"
          className="rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
        >
          New event
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {events.length === 0 ? (
          <p className="px-6 py-10 text-center text-stone-500">No events yet. Create one to get started.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Start</th>
                <th className="px-4 py-3 font-medium">Place</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-stone-900">{event.title}</td>
                  <td className="px-4 py-3 text-stone-600">
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{event.place?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        event.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {event.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="text-amber-800 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
