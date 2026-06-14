import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toSlug } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    excerpt?: string;
    body?: string;
    coverImage?: string;
    placeId?: string | null;
    status?: "DRAFT" | "PUBLISHED";
  };

  if (!body.title || !body.body) {
    return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
  }

  const slug = toSlug(body.title);
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "An article with this title already exists" }, { status: 400 });
  }

  const article = await prisma.article.create({
    data: {
      title: body.title,
      slug,
      excerpt: body.excerpt,
      body: body.body,
      coverImage: body.coverImage || null,
      placeId: body.placeId || null,
      status: body.status ?? "DRAFT",
      publishedAt: body.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json(article);
}
