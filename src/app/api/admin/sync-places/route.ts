import { auth } from "@/lib/auth";
import { syncPlacesFromGoogle } from "@/lib/places-sync";
import { seedMockPlaces } from "@/lib/seed";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { mode?: "google" | "mock" };

  try {
    if (body.mode === "mock") {
      const synced = await seedMockPlaces();
      return NextResponse.json({ synced, source: "mock" });
    }

    const result = await syncPlacesFromGoogle();
    if (result.source === "mock" && result.synced === 0) {
      const synced = await seedMockPlaces();
      return NextResponse.json({
        synced,
        source: "mock",
        message: "No Google API key configured; seeded mock Worcester data instead.",
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 },
    );
  }
}
