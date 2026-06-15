import { city } from "@/config/city";
import { toSlug } from "@/lib/utils";
import type { PlaceCategory } from "@prisma/client";

export interface NormalizedOsmPlace {
  slug: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: PlaceCategory;
  phone: string | null;
  website: string | null;
  hours: { raw: string } | null;
  citySlug: string;
}

interface OsmElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OsmElement[];
}

function mapCategory(tags: Record<string, string>): PlaceCategory {
  const amenity = tags.amenity ?? "";
  const leisure = tags.leisure ?? "";
  if (leisure === "golf_course") return "GOLF";
  if (amenity === "cafe" || amenity === "coffee_shop") return "CAFE";
  if (amenity === "bar" || amenity === "pub" || amenity === "night_club") return "BAR";
  return "RESTAURANT";
}

export async function fetchOverpassPlaces(osmTagFilter: string): Promise<NormalizedOsmPlace[]> {
  const { bounds, slug: citySlug } = city;
  const bbox = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
  const query = `[out:json][timeout:30];(node${osmTagFilter}(${bbox});way${osmTagFilter}(${bbox});relation${osmTagFilter}(${bbox}););out center;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);

  const data = (await res.json()) as OverpassResponse;
  const seen = new Set<string>();
  const places: NormalizedOsmPlace[] = [];

  for (const el of data.elements) {
    const tags = el.tags ?? {};
    const name = tags.name;
    if (!name) continue;

    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (!lat || !lng) continue;

    const slug = toSlug(name);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);

    const houseNum = tags["addr:housenumber"] ?? "";
    const street = tags["addr:street"] ?? "";
    const address = [houseNum, street].filter(Boolean).join(" ") || "Worcester, MA";

    const phone = tags.phone ?? tags["contact:phone"] ?? null;
    const website = tags.website ?? tags["contact:website"] ?? null;
    const openingHours = tags.opening_hours ?? null;

    places.push({
      slug,
      name,
      address,
      lat,
      lng,
      category: mapCategory(tags),
      phone,
      website,
      hours: openingHours ? { raw: openingHours } : null,
      citySlug,
    });
  }

  return places;
}
