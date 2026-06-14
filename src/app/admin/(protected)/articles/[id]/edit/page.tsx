import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { prisma } from "@/lib/db";
import { getAllPlacesForAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const [article, places] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    getAllPlacesForAdmin(),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-stone-900">Edit article</h1>
      <div className="mt-8">
        <ArticleForm places={places} article={article} />
      </div>
    </div>
  );
}
