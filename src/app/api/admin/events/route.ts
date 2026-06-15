import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toSlug } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    include: { place: true },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string | null;
    location?: string;
    placeId?: string | null;
    isPublished?: boolean;
  };

  if (!body.title || !body.startDate) {
    return NextResponse.json({ error: "Title and start date are required" }, { status: 400 });
  }

  const slug = toSlug(body.title);
  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "An event with this title already exists" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title: body.title,
      slug,
      description: body.description || null,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      location: body.location || null,
      placeId: body.placeId || null,
      isPublished: body.isPublished ?? false,
    },
  });

  return NextResponse.json(event);
}
