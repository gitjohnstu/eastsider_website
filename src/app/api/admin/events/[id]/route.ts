import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toSlug } from "@/lib/utils";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
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

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const slug = toSlug(body.title);
  const slugConflict = await prisma.event.findFirst({ where: { slug, NOT: { id } } });
  if (slugConflict) {
    return NextResponse.json({ error: "An event with this title already exists" }, { status: 400 });
  }

  const event = await prisma.event.update({
    where: { id },
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

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
