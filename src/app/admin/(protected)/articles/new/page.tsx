import { ArticleForm } from "@/components/admin/ArticleForm";
import { getAllPlacesForAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const places = await getAllPlacesForAdmin();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-stone-900">New article</h1>
      <div className="mt-8">
        <ArticleForm places={places} />
      </div>
    </div>
  );
}
