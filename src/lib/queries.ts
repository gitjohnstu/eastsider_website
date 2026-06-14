import { prisma } from "@/lib/db";
import type { ArticleStatus, PlaceCategory } from "@prisma/client";

export async function getPublishedArticles(limit?: number) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { place: true, tags: true },
    orderBy: { publishedAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: { place: true, tags: true },
  });
}

export async function getPlaces(category?: PlaceCategory, limit?: number) {
  return prisma.place.findMany({
    where: {
      citySlug: "worcester-ma",
      ...(category ? { category } : {}),
    },
    orderBy: { name: "asc" },
    ...(limit ? { take: limit } : {}),
  });
}

export async function getPlaceBySlug(slug: string) {
  return prisma.place.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      },
    },
  });
}

export async function getAdminStats() {
  const [placeCount, articleCount, draftCount, publishedCount] =
    await Promise.all([
      prisma.place.count({ where: { citySlug: "worcester-ma" } }),
      prisma.article.count(),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
    ]);

  return { placeCount, articleCount, draftCount, publishedCount };
}

export async function getAllArticlesForAdmin() {
  return prisma.article.findMany({
    include: { place: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAllPlacesForAdmin() {
  return prisma.place.findMany({
    where: { citySlug: "worcester-ma" },
    orderBy: { name: "asc" },
  });
}

export type ArticleWithPlace = Awaited<
  ReturnType<typeof getPublishedArticles>
>[number];

export type PlaceWithArticles = NonNullable<
  Awaited<ReturnType<typeof getPlaceBySlug>>
>;

export type ArticleStatusType = ArticleStatus;
