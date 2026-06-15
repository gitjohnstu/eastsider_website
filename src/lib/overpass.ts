import https from "https";
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

// Use Node's native https module to bypass Next.js's patched fetch,
// which sends headers (Accept-Encoding, x-nextjs-*) that Overpass rejects with 406.
function httpsPost(url: string, body: string, signal?: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const { hostname, pathname, search } = new URL(url);
    const bodyBuf = Buffer.from(body, "utf8");

    const req = https.request(
      {
        hostname,
        path: pathname + search,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": bodyBuf.length,
          "User-Agent": "eastsider/1.0",
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => {
          const statusCode = res.statusCode ?? 0;
          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`Overpass API error: ${statusCode}`));
          } else {
            resolve(Buffer.concat(chunks).toString("utf8"));
          }
        });
      },
    );

    req.on("error", reject);

    if (signal) {
      signal.addEventListener("abort", () => {
        req.destroy(new Error("Request aborted"));
      });
    }

    req.write(bodyBuf);
    req.end();
  });
}

export async function fetchOverpassPlaces(
  osmTagFilter: string,
  signal?: AbortSignal,
): Promise<NormalizedOsmPlace[]> {
  const { bounds, slug: citySlug } = city;
  const bbox = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
  const query = `[out:json][timeout:20];(node${osmTagFilter}(${bbox});way${osmTagFilter}(${bbox});relation${osmTagFilter}(${bbox}););out center;`;

  const raw = await httpsPost(
    "https://overpass-api.de/api/interpreter",
    `data=${encodeURIComponent(query)}`,
    signal,
  );

  const data = JSON.parse(raw) as OverpassResponse;
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
