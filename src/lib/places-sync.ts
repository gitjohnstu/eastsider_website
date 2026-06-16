import { cities } from "@/config/city";
const city = cities["worcester-ma"];
import { prisma } from "@/lib/db";
import { isWithinCityBounds, toSlug } from "@/lib/utils";
import type { PlaceCategory } from "@prisma/client";

interface GooglePlaceResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  types?: string[];
  rating?: number;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  photos?: { name: string }[];
}

function mapGoogleTypeToCategory(types: string[] = []): PlaceCategory {
  if (types.includes("restaurant")) return "RESTAURANT";
  if (types.includes("cafe") || types.includes("coffee_shop")) return "CAFE";
  if (types.includes("bar") || types.includes("night_club")) return "BAR";
  if (types.includes("park")) return "PARK";
  if (types.includes("museum")) return "MUSEUM";
  if (types.includes("tourist_attraction")) return "ATTRACTION";
  return "OTHER";
}

async function searchPlaces(
  apiKey: string,
  query: string,
): Promise<GooglePlaceResult[]> {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours,places.photos",
      },
      body: JSON.stringify({
        textQuery: `${query} in Worcester MA`,
        locationRestriction: {
          rectangle: {
            low: {
              latitude: city.bounds.south,
              longitude: city.bounds.west,
            },
            high: {
              latitude: city.bounds.north,
              longitude: city.bounds.east,
            },
          },
        },
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Places API error: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { places?: GooglePlaceResult[] };
  return data.places ?? [];
}

async function upsertPlaceFromGoogle(place: GooglePlaceResult) {
  const lat = place.location?.latitude;
  const lng = place.location?.longitude;
  const name = place.displayName?.text;
  const address = place.formattedAddress;

  if (!lat || !lng || !name || !address) return null;
  if (!isWithinCityBounds(lat, lng, city.bounds)) return null;

  const slug = toSlug(name);
  const category = mapGoogleTypeToCategory(place.types);
  const hours = place.regularOpeningHours?.weekdayDescriptions ?? null;

  return prisma.place.upsert({
    where: { googlePlaceId: place.id },
    create: {
      googlePlaceId: place.id,
      name,
      slug,
      address,
      lat,
      lng,
      category,
      hours: hours ? { weekdayDescriptions: hours } : undefined,
      phone: place.nationalPhoneNumber,
      website: place.websiteUri,
      rating: place.rating,
      photoUrls: [],
      citySlug: city.slug,
      lastSyncedAt: new Date(),
    },
    update: {
      name,
      address,
      lat,
      lng,
      category,
      hours: hours ? { weekdayDescriptions: hours } : undefined,
      phone: place.nationalPhoneNumber,
      website: place.websiteUri,
      rating: place.rating,
      lastSyncedAt: new Date(),
    },
  });
}

const SYNC_QUERIES = [
  "restaurants Shrewsbury Street Worcester",
  "restaurants Canal District Worcester",
  "cafes Worcester MA",
  "bars Worcester MA",
  "parks Worcester MA",
  "museums Worcester MA",
  "tourist attractions Worcester MA",
  "Worcester Art Museum",
  "EcoTarium Worcester",
  "Worcester Common",
];

export async function syncPlacesFromGoogle(): Promise<{
  synced: number;
  source: "google" | "mock";
}> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return { synced: 0, source: "mock" };
  }

  let synced = 0;
  const seen = new Set<string>();

  for (const query of SYNC_QUERIES) {
    const results = await searchPlaces(apiKey, query);
    for (const result of results) {
      if (!result.id || seen.has(result.id)) continue;
      seen.add(result.id);
      const upserted = await upsertPlaceFromGoogle(result);
      if (upserted) synced++;
    }
  }

  return { synced, source: "google" };
}
