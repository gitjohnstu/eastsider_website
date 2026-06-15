import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { getEventById, getAllPlacesForAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const [event, places] = await Promise.all([
    getEventById(id),
    getAllPlacesForAdmin(),
  ]);

  if (!event) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-stone-900">Edit event</h1>
      <div className="mt-8">
        <EventForm places={places} event={event} />
      </div>
    </div>
  );
}
