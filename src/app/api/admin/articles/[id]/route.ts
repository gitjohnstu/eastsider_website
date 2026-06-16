import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toSlug } from "@/lib/utils";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    title?: string;
    excerpt?: string;
    body?: string;
    coverImage?: string;
    placeId?: string | null;
    citySlug?: string;
    status?: "DRAFT" | "PUBLISHED";
  };

  if (!body.title || !body.body) {
    return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
  }

  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const slug = toSlug(body.title);
  const slugConflict = await prisma.article.findFirst({
    where: { slug, NOT: { id } },
  });
  if (slugConflict) {
    return NextResponse.json({ error: "An article with this title already exists" }, { status: 400 });
  }

  const publishedAt =
    body.status === "PUBLISHED"
      ? existing.publishedAt ?? new Date()
      : null;

  const article = await prisma.article.update({
    where: { id },
    data: {
      title: body.title,
      slug,
      excerpt: body.excerpt,
      body: body.body,
      coverImage: body.coverImage || null,
      placeId: body.placeId || null,
      citySlug: body.citySlug ?? existing.citySlug,
      status: body.status ?? "DRAFT",
      publishedAt,
    },
  });

  return NextResponse.json(article);
}
