import { prisma } from "@/lib/db";
import type { ArticleStatus, PlaceCategory } from "@prisma/client";

export async function getPublishedArticles(citySlug: string, limit?: number) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", citySlug },
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

export async function getPlaces(citySlug: string, category?: PlaceCategory, limit?: number) {
  return prisma.place.findMany({
    where: {
      citySlug,
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

export async function getAdminStats(citySlug?: string) {
  const placeWhere = citySlug ? { citySlug } : {};
  const articleWhere = citySlug ? { citySlug } : {};

  const [placeCount, articleCount, draftCount, publishedCount] =
    await Promise.all([
      prisma.place.count({ where: placeWhere }),
      prisma.article.count({ where: articleWhere }),
      prisma.article.count({ where: { ...articleWhere, status: "DRAFT" } }),
      prisma.article.count({ where: { ...articleWhere, status: "PUBLISHED" } }),
    ]);

  return { placeCount, articleCount, draftCount, publishedCount };
}

export async function getAllArticlesForAdmin(citySlug?: string) {
  return prisma.article.findMany({
    where: citySlug ? { citySlug } : {},
    include: { place: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAllPlacesForAdmin(citySlug?: string) {
  return prisma.place.findMany({
    where: citySlug ? { citySlug } : {},
    orderBy: { name: "asc" },
  });
}

export async function getUpcomingEvents(citySlug: string, limit = 5) {
  return prisma.event.findMany({
    where: { isPublished: true, startDate: { gte: new Date() }, citySlug },
    include: { place: true },
    orderBy: { startDate: "asc" },
    take: limit,
  });
}

export async function getAllEventsForAdmin(citySlug?: string) {
  return prisma.event.findMany({
    where: citySlug ? { citySlug } : {},
    include: { place: true },
    orderBy: { startDate: "asc" },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({ where: { id }, include: { place: true } });
}

export type ArticleWithPlace = Awaited<
  ReturnType<typeof getPublishedArticles>
>[number];

export type PlaceWithArticles = NonNullable<
  Awaited<ReturnType<typeof getPlaceBySlug>>
>;

export type EventWithPlace = Awaited<
  ReturnType<typeof getUpcomingEvents>
>[number];

export type ArticleStatusType = ArticleStatus;
