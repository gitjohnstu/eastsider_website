export const siteConfig = {
  name: "Eastsider",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://eastsider.org",
} as const;

// All possible navigation groups across every city
export const allNavGroups = {
  food: {
    label: "Restaurants",
    categories: ["RESTAURANT", "CAFE", "BAR"] as const,
    osmTags: '["amenity"~"^(restaurant|cafe|bar|pub|fast_food|night_club)$"]',
    subFilters: [
      { value: "RESTAURANT" as const, label: "Restaurants" },
      { value: "CAFE" as const, label: "Cafes" },
      { value: "BAR" as const, label: "Bars" },
    ],
  },
  golf: {
    label: "Golf",
    categories: ["GOLF"] as const,
    osmTags: '["leisure"="golf_course"]',
    subFilters: [] as { value: string; label: string }[],
  },
  ski: {
    label: "Ski & Outdoor",
    categories: ["SKI"] as const,
    osmTags: '["sport"="skiing"]["name"]',
    subFilters: [] as { value: string; label: string }[],
  },
} as const;

export type NavGroupKey = keyof typeof allNavGroups;

export const placeCategories = [
  { value: "RESTAURANT", label: "Restaurants" },
  { value: "CAFE", label: "Cafes" },
  { value: "BAR", label: "Bars" },
  { value: "PARK", label: "Parks" },
  { value: "MUSEUM", label: "Museums" },
  { value: "ATTRACTION", label: "Things to Do" },
  { value: "GOLF", label: "Golf" },
  { value: "SKI", label: "Ski & Outdoor" },
  { value: "OTHER", label: "Other" },
] as const;

export const cities = {
  "worcester-ma": {
    name: "Worcester",
    state: "MA",
    slug: "worcester-ma" as const,
    tagline: "Worcester's guide to restaurants & places to go",
    description:
      "Discover the best restaurants, bars, and things to do in Worcester, Massachusetts.",
    center: { lat: 42.2626, lng: -71.8023 },
    bounds: { north: 42.36, south: 42.17, east: -71.67, west: -71.97 },
    theme: {
      headerBg: "#0f0c0a",
      mastheadBg: "#f5efe6",
      accent: "#9e7040",
      border: "#dbd3c5",
    },
    navGroupKeys: ["food", "golf"] as const,
  },
  "beacon-ny": {
    name: "Beacon",
    state: "NY",
    slug: "beacon-ny" as const,
    tagline: "Hudson Valley arts, dining & culture",
    description:
      "Discover the best restaurants, galleries, and places in Beacon, New York.",
    center: { lat: 41.5048, lng: -73.97 },
    bounds: { north: 41.56, south: 41.45, east: -73.9, west: -74.04 },
    theme: {
      headerBg: "#1b1522",
      mastheadBg: "#f0ece6",
      accent: "#9e5030",
      border: "#ddd6ce",
    },
    navGroupKeys: ["food", "golf"] as const,
  },
  "whiteface-ny": {
    name: "Whiteface",
    state: "NY",
    slug: "whiteface-ny" as const,
    tagline: "Adirondack mountain life & alpine dining",
    description:
      "Discover the best restaurants, ski resorts, and mountain life near Whiteface Mountain, New York.",
    center: { lat: 44.3659, lng: -73.902 },
    bounds: { north: 44.45, south: 44.25, east: -73.75, west: -74.1 },
    theme: {
      headerBg: "#0d1a0f",
      mastheadBg: "#eef0eb",
      accent: "#7a6b3a",
      border: "#cdd4c8",
    },
    navGroupKeys: ["food", "golf", "ski"] as const,
  },
} as const;

export type CitySlug = keyof typeof cities;
export type CityConfig = (typeof cities)[CitySlug];

export function getCity(slug: string): CityConfig | null {
  return slug in cities ? cities[slug as CitySlug] : null;
}

export const cityList = Object.values(cities);

// Return only the nav groups active for a given city
export function getCityNavGroups(navGroupKeys: readonly NavGroupKey[]) {
  return Object.fromEntries(
    navGroupKeys.map((k) => [k, allNavGroups[k]])
  ) as Pick<typeof allNavGroups, (typeof navGroupKeys)[number]>;
}
