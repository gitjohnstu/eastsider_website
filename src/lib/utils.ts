import slugify from "slugify";

export function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

export function isWithinCityBounds(
  lat: number,
  lng: number,
  bounds: { north: number; south: number; east: number; west: number },
): boolean {
  return (
    lat <= bounds.north &&
    lat >= bounds.south &&
    lng <= bounds.east &&
    lng >= bounds.west
  );
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    RESTAURANT: "Restaurant",
    CAFE: "Cafe",
    BAR: "Bar",
    PARK: "Park",
    MUSEUM: "Museum",
    ATTRACTION: "Attraction",
    OTHER: "Place",
  };
  return labels[category] ?? "Place";
}
