export const city = {
  name: "Worcester",
  slug: "worcester-ma",
  state: "MA",
  country: "US",
  center: { lat: 42.2626, lng: -71.8023 },
  bounds: {
    north: 42.32,
    south: 42.2,
    east: -71.72,
    west: -71.88,
  },
} as const;

export type CityConfig = typeof city;

export const siteConfig = {
  name: "Eastsider",
  tagline: "Worcester's guide to restaurants & places to go",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://eastsider.org",
  description:
    "Discover the best restaurants, bars, parks, and things to do in Worcester, Massachusetts.",
};

export const placeCategories = [
  { value: "RESTAURANT", label: "Restaurants" },
  { value: "CAFE", label: "Cafes" },
  { value: "BAR", label: "Bars" },
  { value: "PARK", label: "Parks" },
  { value: "MUSEUM", label: "Museums" },
  { value: "ATTRACTION", label: "Things to Do" },
  { value: "GOLF", label: "Golf" },
  { value: "OTHER", label: "Other" },
] as const;

export const navGroups = {
  food: {
    label: "Restaurants",
    categories: ["RESTAURANT", "CAFE", "BAR"] as const,
    subFilters: [
      { value: "RESTAURANT" as const, label: "Restaurants" },
      { value: "CAFE" as const, label: "Cafes" },
      { value: "BAR" as const, label: "Bars" },
    ],
  },
  golf: {
    label: "Golf",
    categories: ["GOLF"] as const,
    subFilters: [] as { value: string; label: string }[],
  },
} as const;

export type NavGroupKey = keyof typeof navGroups;

export const neighborhoods = [
  "Downtown",
  "Canal District",
  "Shrewsbury Street",
  "Greendale",
  "Main South",
  "West Side",
  "Burncoat",
  "Indian Hill",
] as const;
