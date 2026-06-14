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
  { value: "BAR", label: "Bars & Nightlife" },
  { value: "PARK", label: "Parks" },
  { value: "MUSEUM", label: "Museums" },
  { value: "ATTRACTION", label: "Things to Do" },
  { value: "OTHER", label: "Other" },
] as const;

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
