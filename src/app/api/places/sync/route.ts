import { NextResponse } from "next/server";
import { navGroups } from "@/config/city";
import { prisma } from "@/lib/db";
import { fetchOverpassPlaces } from "@/lib/overpass";
import type { NavGroupKey } from "@/config/city";
import type { PlaceCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

// Only skip OSM sync once the DB has a healthy number of real places.
// The mock seed adds ~20 places, so a threshold of 50 ensures the first real
// OSM fetch always runs regardless of mock data.
const SYNC_THRESHOLD = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get("group") as NavGroupKey | null;

  if (!group || !(group in navGroups)) {
    return NextResponse.json({ error: "Invalid group" }, { status: 400 });
  }

  const groupDef = navGroups[group];
  const categories = groupDef.categories as unknown as PlaceCategory[];

  // Skip only if we already have a full set of OSM places for this group
  const placeCount = await prisma.place.count({
    where: { category: { in: categories }, citySlug: "worcester-ma" },
  });

  if (placeCount >= SYNC_THRESHOLD) {
    return NextResponse.json({ synced: 0, cached: true });
  }

  // Abort Overpass if it takes too long (safety net for serverless timeouts)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  let places;
  try {
    places = await fetchOverpassPlaces(groupDef.osmTags, controller.signal);
  } catch (err) {
    console.error("[sync] Overpass fetch failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Overpass API unavailable" }, { status: 503 });
  } finally {
    clearTimeout(timeout);
  }

  let synced = 0;
  for (const place of places) {
    try {
      await prisma.place.upsert({
        where: { slug: place.slug },
        create: {
          slug: place.slug,
          name: place.name,
          address: place.address,
          lat: place.lat,
          lng: place.lng,
          category: place.category,
          phone: place.phone,
          website: place.website,
          hours: place.hours ?? undefined,
          citySlug: place.citySlug,
          lastSyncedAt: new Date(),
        },
        update: {
          address: place.address,
          lat: place.lat,
          lng: place.lng,
          category: place.category,
          phone: place.phone,
          website: place.website,
          hours: place.hours ?? undefined,
          lastSyncedAt: new Date(),
        },
      });
      synced++;
    } catch {
      // Skip individual upsert failures (e.g. slug collision from concurrent requests)
    }
  }

  return NextResponse.json({ synced });
}
