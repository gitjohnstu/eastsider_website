import { auth } from "@/lib/auth";
import { getCity } from "@/config/city";
import { seedBeaconArticles, seedWhitefaceArticles } from "@/lib/seed-city-content";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "city param required (e.g. ?city=beacon-ny)" }, { status: 400 });
  }

  const cityConfig = getCity(city);
  if (!cityConfig) {
    return NextResponse.json({ error: `Unknown city: ${city}` }, { status: 400 });
  }

  let seeded = 0;
  if (city === "beacon-ny") {
    seeded = await seedBeaconArticles();
  } else if (city === "whiteface-ny") {
    seeded = await seedWhitefaceArticles();
  } else {
    return NextResponse.json({ error: `No seed content defined for city: ${city}` }, { status: 400 });
  }

  return NextResponse.json({ seeded, city });
}
