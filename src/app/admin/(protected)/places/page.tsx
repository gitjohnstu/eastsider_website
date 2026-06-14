import Link from "next/link";
import { getAllPlacesForAdmin } from "@/lib/queries";
import { categoryLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPlacesPage() {
  const places = await getAllPlacesForAdmin();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-stone-900">Places</h1>
      <p className="mt-2 text-stone-600">
        {places.length} Worcester venues imported into the database.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Neighborhood</th>
              <th className="px-4 py-3 font-medium">Address</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/places/${place.slug}`}
                    className="font-medium text-stone-900 hover:text-amber-800"
                  >
                    {place.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{categoryLabel(place.category)}</td>
                <td className="px-4 py-3">{place.neighborhood ?? "—"}</td>
                <td className="px-4 py-3 text-stone-600">{place.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
