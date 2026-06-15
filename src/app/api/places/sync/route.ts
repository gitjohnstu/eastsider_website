import { NextResponse } from "next/server";
import { navGroups } from "@/config/city";
import { prisma } from "@/lib/db";
import { fetchOverpassPlaces } from "@/lib/overpass";
import type { NavGroupKey } from "@/config/city";
import type { PlaceCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get("group") as NavGroupKey | null;

  if (!group || !(group in navGroups)) {
    return NextResponse.json({ error: "Invalid group" }, { status: 400 });
  }

  const groupDef = navGroups[group];
  const categories = groupDef.categories as unknown as PlaceCategory[];

  // Skip if any place in this category was synced within the last 6 hours
  const recentlySynced = await prisma.place.findFirst({
    where: {
      category: { in: categories },
      citySlug: "worcester-ma",
      lastSyncedAt: { gte: new Date(Date.now() - SIX_HOURS_MS) },
    },
    select: { id: true },
  });

  if (recentlySynced) {
    return NextResponse.json({ synced: 0, cached: true });
  }

  let places;
  try {
    places = await fetchOverpassPlaces(groupDef.osmTags);
  } catch {
    return NextResponse.json({ error: "Overpass API unavailable" }, { status: 503 });
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
