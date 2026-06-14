import Link from "next/link";
import { getAdminStats } from "@/lib/queries";
import { SyncPlacesButton } from "@/components/admin/SyncPlacesButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-stone-900">Dashboard</h1>
      <p className="mt-2 text-stone-600">Manage Worcester places and articles.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Places", value: stats.placeCount },
          { label: "Articles", value: stats.articleCount },
          { label: "Published", value: stats.publishedCount },
          { label: "Drafts", value: stats.draftCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-stone-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-stone-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold">Places sync</h2>
          <p className="mt-2 text-sm text-stone-600">
            Import real Worcester venues from Google Places (when API key is set)
            or seed mock local data.
          </p>
          <div className="mt-4">
            <SyncPlacesButton />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/articles/new"
              className="rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
            >
              New article
            </Link>
            <Link
              href="/admin/articles"
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50"
            >
              Manage articles
            </Link>
            <Link
              href="/admin/places"
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50"
            >
              Browse places
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
