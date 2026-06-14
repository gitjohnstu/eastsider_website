import Link from "next/link";
import { getAllArticlesForAdmin } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Articles</h1>
          <p className="mt-2 text-stone-600">Draft, edit, and publish Worcester stories.</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
        >
          New article
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Place</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-3 font-medium text-stone-900">{article.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      article.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600">{article.place?.name ?? "—"}</td>
                <td className="px-4 py-3 text-stone-600">{formatDate(article.updatedAt)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-amber-800 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
