import { prisma } from "@/lib/db";
import type { PlaceCategory } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type SearchType = "all" | "articles" | "places";

export interface SearchResult {
  type: "article" | "place";
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  category?: PlaceCategory;
  coverImage?: string | null;
  address?: string;
  rank: number;
}

async function searchArticlesFts(
  query: string,
  citySlug: string,
  limit: number,
): Promise<SearchResult[]> {
  const articles = await prisma.$queryRaw<
    {
      id: string;
      title: string;
      slug: string;
      excerpt: string | null;
      coverImage: string | null;
      rank: number;
    }[]
  >`
    SELECT
      a.id,
      a.title,
      a.slug,
      a.excerpt,
      a."coverImage",
      ts_rank(
        to_tsvector('english', coalesce(a.title, '') || ' ' || coalesce(a.excerpt, '') || ' ' || coalesce(a.body, '')),
        plainto_tsquery('english', ${query})
      ) AS rank
    FROM "Article" a
    WHERE a.status = 'PUBLISHED'
      AND a."citySlug" = ${citySlug}
      AND to_tsvector('english', coalesce(a.title, '') || ' ' || coalesce(a.excerpt, '') || ' ' || coalesce(a.body, ''))
        @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${limit}
  `;

  return articles.map((a) => ({
    type: "article" as const,
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    coverImage: a.coverImage,
    rank: Number(a.rank),
  }));
}

async function searchPlacesFts(
  query: string,
  citySlug: string,
  categories: PlaceCategory[],
  limit: number,
): Promise<SearchResult[]> {
  const categoryFilter =
    categories.length === 1
      ? Prisma.sql`AND p.category = ${categories[0]}::"PlaceCategory"`
      : categories.length > 1
        ? Prisma.sql`AND p.category::text = ANY(${categories})`
        : Prisma.empty;

  const places = await prisma.$queryRaw<
    {
      id: string;
      name: string;
      slug: string;
      address: string;
      category: PlaceCategory;
      rank: number;
    }[]
  >`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.address,
      p.category,
      ts_rank(
        to_tsvector('english', coalesce(p.name, '') || ' ' || coalesce(p.address, '') || ' ' || coalesce(p.neighborhood, '')),
        plainto_tsquery('english', ${query})
      ) AS rank
    FROM "Place" p
    WHERE p."citySlug" = ${citySlug}
      ${categoryFilter}
      AND to_tsvector('english', coalesce(p.name, '') || ' ' || coalesce(p.address, '') || ' ' || coalesce(p.neighborhood, ''))
        @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${limit}
  `;

  return places.map((p) => ({
    type: "place" as const,
    id: p.id,
    title: p.name,
    slug: p.slug,
    excerpt: p.address,
    category: p.category,
    address: p.address,
    rank: Number(p.rank),
  }));
}

async function searchArticlesSimple(
  query: string,
  citySlug: string,
  limit: number,
): Promise<SearchResult[]> {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      citySlug,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
        { body: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
    orderBy: { publishedAt: "desc" },
  });

  return articles.map((a, index) => ({
    type: "article" as const,
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    coverImage: a.coverImage,
    rank: limit - index,
  }));
}

async function searchPlacesSimpleResults(
  query: string,
  citySlug: string,
  categories: PlaceCategory[],
  limit: number,
): Promise<SearchResult[]> {
  const places = await prisma.place.findMany({
    where: {
      citySlug,
      ...(categories.length > 0 ? { category: { in: categories } } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { address: { contains: query, mode: "insensitive" } },
              { neighborhood: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    take: limit,
    orderBy: { name: "asc" },
  });

  return places.map((p, index) => ({
    type: "place" as const,
    id: p.id,
    title: p.name,
    slug: p.slug,
    excerpt: p.address,
    category: p.category,
    address: p.address,
    rank: limit - index,
  }));
}

export async function searchCity(
  query: string,
  citySlug: string,
  options: {
    type?: SearchType;
    categories?: PlaceCategory[];
    limit?: number;
  } = {},
): Promise<SearchResult[]> {
  const { type = "all", categories = [], limit = 20 } = options;
  const trimmed = query.trim();

  const placesOnly = type === "places" || categories.length > 0;

  try {
    if (trimmed) {
      const ftsResults: SearchResult[] = [];

      if (!placesOnly) {
        ftsResults.push(...(await searchArticlesFts(trimmed, citySlug, limit)));
      }
      ftsResults.push(...(await searchPlacesFts(trimmed, citySlug, categories, limit)));

      if (ftsResults.length > 0) {
        return ftsResults.sort((a, b) => b.rank - a.rank).slice(0, limit);
      }
    }

    const simpleResults: SearchResult[] = [];

    if (!placesOnly && trimmed) {
      simpleResults.push(...(await searchArticlesSimple(trimmed, citySlug, limit)));
    }
    simpleResults.push(
      ...(await searchPlacesSimpleResults(trimmed, citySlug, categories, limit)),
    );

    return simpleResults.sort((a, b) => b.rank - a.rank).slice(0, limit);
  } catch {
    const results: SearchResult[] = [];
    if (!placesOnly && trimmed) {
      results.push(...(await searchArticlesSimple(trimmed, citySlug, limit)));
    }
    results.push(...(await searchPlacesSimpleResults(trimmed, citySlug, categories, limit)));
    return results.sort((a, b) => b.rank - a.rank).slice(0, limit);
  }
}

export async function searchPlacesSimple(
  query: string,
  citySlug: string,
  category?: PlaceCategory,
  limit = 20,
) {
  return prisma.place.findMany({
    where: {
      citySlug,
      ...(category ? { category } : {}),
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { address: { contains: query, mode: "insensitive" } },
        { neighborhood: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { name: "asc" },
    take: limit,
  });
}
