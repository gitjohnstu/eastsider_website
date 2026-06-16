import { NextRequest, NextResponse } from "next/server";
import { searchCity } from "@/lib/search";
import { allNavGroups, getCity } from "@/config/city";
import type { NavGroupKey } from "@/config/city";
import type { PlaceCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const cityParam = searchParams.get("city") ?? "";
  const group = searchParams.get("group") as NavGroupKey | null;
  const subCategory = searchParams.get("category") as PlaceCategory | null;

  const cityConfig = getCity(cityParam);
  if (!cityConfig) {
    return NextResponse.json({ error: "Invalid city" }, { status: 400 });
  }

  // Resolve which categories to search
  let categories: PlaceCategory[] = [];
  if (group && group in allNavGroups) {
    const groupDef = allNavGroups[group as NavGroupKey];
    if (subCategory && (groupDef.categories as readonly string[]).includes(subCategory)) {
      categories = [subCategory];
    } else {
      categories = [...groupDef.categories] as PlaceCategory[];
    }
  } else if (subCategory) {
    categories = [subCategory];
  }

  try {
    const results = await searchCity(q, cityConfig.slug, { categories });
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
