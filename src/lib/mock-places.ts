import { city } from "@/config/city";
import { prisma } from "@/lib/db";
import { toSlug } from "@/lib/utils";
import type { PlaceCategory } from "@prisma/client";

interface MockPlace {
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: PlaceCategory;
  neighborhood: string;
  phone?: string;
  website?: string;
  rating?: number;
  hours?: string[];
}

const WORCESTER_PLACES: MockPlace[] = [
  {
    name: "Deadhorse Hill",
    address: "281 Main St, Worcester, MA 01608",
    lat: 42.2629,
    lng: -71.8012,
    category: "RESTAURANT",
    neighborhood: "Downtown",
    rating: 4.6,
    website: "https://deadhorsehill.com",
    hours: ["Mon-Thu 5pm-10pm", "Fri-Sat 5pm-11pm", "Sun 10am-2pm, 5pm-9pm"],
  },
  {
    name: "Lock 50",
    address: "50 Water St, Worcester, MA 01604",
    lat: 42.2598,
    lng: -71.7975,
    category: "RESTAURANT",
    neighborhood: "Canal District",
    rating: 4.5,
    hours: ["Tue-Thu 4pm-9pm", "Fri-Sat 4pm-10pm", "Sun 11am-3pm"],
  },
  {
    name: "Nuovo",
    address: "92 Shrewsbury St, Worcester, MA 01604",
    lat: 42.2675,
    lng: -71.7878,
    category: "RESTAURANT",
    neighborhood: "Shrewsbury Street",
    rating: 4.4,
    hours: ["Mon-Thu 11:30am-9pm", "Fri-Sat 11:30am-10pm", "Sun 4pm-9pm"],
  },
  {
    name: "Baba Restaurant & Sushi Bar",
    address: "100 Shrewsbury St, Worcester, MA 01604",
    lat: 42.2678,
    lng: -71.7872,
    category: "RESTAURANT",
    neighborhood: "Shrewsbury Street",
    rating: 4.3,
  },
  {
    name: "The Sole Proprietor",
    address: "118 Highland St, Worcester, MA 01609",
    lat: 42.2651,
    lng: -71.8145,
    category: "RESTAURANT",
    neighborhood: "West Side",
    rating: 4.5,
    hours: ["Tue-Sat 5pm-9pm"],
  },
  {
    name: "Mezcal Tequila Cantina",
    address: "30 Major Taylor Blvd, Worcester, MA 01608",
    lat: 42.2622,
    lng: -71.7998,
    category: "RESTAURANT",
    neighborhood: "Downtown",
    rating: 4.2,
  },
  {
    name: "Armsby Abbey",
    address: "144 North Main St, Worcester, MA 01608",
    lat: 42.2658,
    lng: -71.8025,
    category: "BAR",
    neighborhood: "Downtown",
    rating: 4.6,
    hours: ["Mon-Thu 4pm-12am", "Fri-Sat 12pm-1am", "Sun 12pm-10pm"],
  },
  {
    name: "The Raven",
    address: "55 Maywood St, Worcester, MA 01603",
    lat: 42.2565,
    lng: -71.8122,
    category: "BAR",
    neighborhood: "Greendale",
    rating: 4.4,
  },
  {
    name: "Acoustic Java",
    address: "932 Main St, Worcester, MA 01603",
    lat: 42.2548,
    lng: -71.8088,
    category: "CAFE",
    neighborhood: "Main South",
    rating: 4.5,
    hours: ["Mon-Fri 7am-4pm", "Sat-Sun 8am-4pm"],
  },
  {
    name: "Bean Counter Bakery",
    address: "1137 Highland St, Worcester, MA 01609",
    lat: 42.2642,
    lng: -71.8168,
    category: "CAFE",
    neighborhood: "West Side",
    rating: 4.6,
  },
  {
    name: "Worcester Art Museum",
    address: "55 Salisbury St, Worcester, MA 01609",
    lat: 42.2765,
    lng: -71.8035,
    category: "MUSEUM",
    neighborhood: "West Side",
    rating: 4.7,
    website: "https://worcesterart.org",
    hours: ["Wed-Sun 10am-4pm"],
  },
  {
    name: "EcoTarium",
    address: "222 Harrington Way, Worcester, MA 01604",
    lat: 42.2645,
    lng: -71.7755,
    category: "MUSEUM",
    neighborhood: "Burncoat",
    rating: 4.5,
    website: "https://ecotarium.org",
    hours: ["Tue-Sun 10am-5pm"],
  },
  {
    name: "Worcester Common",
    address: "455 Main St, Worcester, MA 01608",
    lat: 42.2625,
    lng: -71.8015,
    category: "PARK",
    neighborhood: "Downtown",
    rating: 4.3,
  },
  {
    name: "Elm Park",
    address: "284 Park Ave, Worcester, MA 01609",
    lat: 42.2688,
    lng: -71.8235,
    category: "PARK",
    neighborhood: "West Side",
    rating: 4.6,
  },
  {
    name: "DCU Center",
    address: "50 Foster St, Worcester, MA 01608",
    lat: 42.2635,
    lng: -71.7982,
    category: "ATTRACTION",
    neighborhood: "Downtown",
    rating: 4.2,
    website: "https://dcucenter.com",
  },
  {
    name: "Cactus Pete's",
    address: "248 Park Ave, Worcester, MA 01609",
    lat: 42.2672,
    lng: -71.8198,
    category: "RESTAURANT",
    neighborhood: "West Side",
    rating: 4.1,
  },
  {
    name: "Volturno Pizza",
    address: "72 Shrewsbury St, Worcester, MA 01604",
    lat: 42.2671,
    lng: -71.7885,
    category: "RESTAURANT",
    neighborhood: "Shrewsbury Street",
    rating: 4.5,
  },
  {
    name: "O'Connor's Restaurant & Bar",
    address: "1160 West Boylston St, Worcester, MA 01606",
    lat: 42.2895,
    lng: -71.7988,
    category: "RESTAURANT",
    neighborhood: "Indian Hill",
    rating: 4.4,
  },
  {
    name: "Railway Tavern",
    address: "65 Franklin St, Worcester, MA 01608",
    lat: 42.2618,
    lng: -71.8005,
    category: "BAR",
    neighborhood: "Downtown",
    rating: 4.3,
  },
  {
    name: "Funky Murphys",
    address: "305 Shrewsbury St, Worcester, MA 01604",
    lat: 42.2695,
    lng: -71.7845,
    category: "BAR",
    neighborhood: "Shrewsbury Street",
    rating: 4.0,
  },
];

export async function seedMockPlaces(): Promise<number> {
  let count = 0;

  for (const place of WORCESTER_PLACES) {
    const slug = toSlug(place.name);
    await prisma.place.upsert({
      where: { slug },
      create: {
        name: place.name,
        slug,
        address: place.address,
        lat: place.lat,
        lng: place.lng,
        category: place.category,
        neighborhood: place.neighborhood,
        phone: place.phone,
        website: place.website,
        rating: place.rating,
        hours: place.hours
          ? { weekdayDescriptions: place.hours }
          : undefined,
        citySlug: city.slug,
        lastSyncedAt: new Date(),
      },
      update: {
        address: place.address,
        lat: place.lat,
        lng: place.lng,
        category: place.category,
        neighborhood: place.neighborhood,
        phone: place.phone,
        website: place.website,
        rating: place.rating,
        hours: place.hours
          ? { weekdayDescriptions: place.hours }
          : undefined,
        lastSyncedAt: new Date(),
      },
    });
    count++;
  }

  return count;
}

const SAMPLE_ARTICLES = [
  {
    title: "Deadhorse Hill: Worcester's Farm-to-Table Star",
    slug: "deadhorse-hill-worcester-review",
    excerpt:
      "Seasonal New American cooking in a restored downtown space — why Deadhorse Hill belongs on every Worcester food list.",
    body: `## A downtown destination worth the hype

Deadhorse Hill has become one of Worcester's most talked-about restaurants, and for good reason. The kitchen leans heavily on New England farms, turning out plates that feel both refined and deeply local.

## What to order

Start with whatever seasonal small plate is on the board — the team changes the menu often. The mains tend toward hearty proteins and beautifully composed vegetables. Save room if there's a dessert special.

## The vibe

Warm lighting, exposed brick, and a bustling open kitchen make this a great pick for a date night or a celebratory dinner downtown.

## Bottom line

If you're exploring Worcester's restaurant scene, Deadhorse Hill is an essential stop.`,
    placeSlug: "deadhorse-hill",
    coverImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
    tags: ["restaurants", "downtown"],
  },
  {
    title: "Shrewsbury Street: Worcester's Restaurant Row",
    slug: "shrewsbury-street-restaurant-guide",
    excerpt:
      "From Nuovo to Volturno, here's how to eat your way down Worcester's most famous dining corridor.",
    body: `## Worcester's culinary main street

Shrewsbury Street is the city's best-known restaurant row — a stretch packed with Italian spots, sushi bars, steakhouses, and late-night favorites.

## Standouts

**Nuovo** delivers polished Italian-American classics in a lively dining room. **Volturno Pizza** is the go-to for Neapolitan pies. **Baba** remains a staple for sushi and cocktails.

## How to plan a visit

Pick one anchor dinner spot, then walk the strip for drinks afterward. Funky Murphys and other bars keep the street active well into the night.

## Why it matters

For visitors and locals alike, Shrewsbury Street is the easiest answer to "where should we eat in Worcester?"`,
    placeSlug: "nuovo",
    coverImage:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=800&fit=crop",
    tags: ["restaurants", "nightlife"],
  },
  {
    title: "A Perfect Afternoon at the Worcester Art Museum",
    slug: "worcester-art-museum-guide",
    excerpt:
      "World-class collections, a welcoming campus, and one of the best cultural anchors in Central Massachusetts.",
    body: `## More than a rainy-day backup

The Worcester Art Museum punches well above its weight. Its collections span centuries and continents, with standout galleries that reward slow wandering.

## Plan your visit

Allow at least two hours. Check the museum calendar for special exhibitions and family programs.

## Pair it with

Grab coffee on Highland Street or make an evening of it with dinner on the West Side after your visit.

## Why locals love it

It's accessible, beautifully curated, and central to Worcester's identity as a city that takes culture seriously.`,
    placeSlug: "worcester-art-museum",
    coverImage:
      "https://images.unsplash.com/photo-1564399579889-4517250c1f83?w=1200&h=800&fit=crop",
    tags: ["weekend", "museums"],
  },
  {
    title: "Canal District: Where Worcester Goes Out",
    slug: "canal-district-worcester-guide",
    excerpt:
      "Water Street's Canal District blends history, nightlife, and standout dining — here's what to hit first.",
    body: `## History with a nightlife pulse

The Canal District is one of Worcester's most character-rich neighborhoods. Warehouses and mill buildings now hold restaurants, bars, and event spaces.

## Start here

**Lock 50** is a reliable dinner pick with a seasonal menu and a great patio feel when the weather cooperates.

## Explore on foot

Walk Water Street, peek into side lots and murals, and catch live music when venues are running.

## Good to know

Parking can fill up on weekend nights — arrive early or rideshare if you're bar-hopping.`,
    placeSlug: "lock-50",
    coverImage:
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&h=800&fit=crop",
    tags: ["nightlife", "restaurants"],
  },
  {
    title: "EcoTarium: Worcester's Best Family Day Out",
    slug: "ecotarium-worcester-family-guide",
    excerpt:
      "Science, nature trails, and hands-on exhibits make the EcoTarium a must for families visiting Worcester.",
    body: `## Science you can touch

The EcoTarium combines indoor exhibits with outdoor trails and wildlife areas — a full-day destination for kids and curious adults.

## Highlights

Interactive science displays, planetarium shows (check schedule), and seasonal outdoor programming.

## Tips

Buy tickets online when possible, pack snacks, and wear comfortable shoes for the trails.

## Make a day of it

Combine with Elm Park or a West Side lunch for an easy Worcester itinerary.`,
    placeSlug: "ecotarium",
    coverImage:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop",
    tags: ["weekend", "parks"],
  },
];

export async function seedSampleArticles(): Promise<number> {
  let count = 0;

  for (const article of SAMPLE_ARTICLES) {
    const place = await prisma.place.findUnique({
      where: { slug: article.placeSlug },
    });

    const tagRecords = await Promise.all(
      article.tags.map(async (tag) => {
        const slug = toSlug(tag);
        return prisma.tag.upsert({
          where: { slug },
          create: { name: tag, slug },
          update: {},
        });
      }),
    );

    await prisma.article.upsert({
      where: { slug: article.slug },
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        body: article.body,
        status: "PUBLISHED",
        coverImage: article.coverImage,
        publishedAt: new Date(),
        placeId: place?.id,
        tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
      },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        status: "PUBLISHED",
        coverImage: article.coverImage,
        placeId: place?.id,
        tags: { set: tagRecords.map((t) => ({ id: t.id })) },
      },
    });
    count++;
  }

  return count;
}
