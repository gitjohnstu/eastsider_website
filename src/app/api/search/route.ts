import { NextRequest, NextResponse } from "next/server";
import { searchCity } from "@/lib/search";
import { navGroups } from "@/config/city";
import type { NavGroupKey } from "@/config/city";
import type { PlaceCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const group = searchParams.get("group") as NavGroupKey | null;
  const subCategory = searchParams.get("category") as PlaceCategory | null;

  // Resolve which categories to search
  let categories: PlaceCategory[] = [];
  if (group && group in navGroups) {
    const groupDef = navGroups[group];
    if (subCategory && (groupDef.categories as readonly string[]).includes(subCategory)) {
      categories = [subCategory];
    } else {
      categories = [...groupDef.categories] as PlaceCategory[];
    }
  } else if (subCategory) {
    categories = [subCategory];
  }

  try {
    const results = await searchCity(q, { categories });
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
