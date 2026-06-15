import { EventForm } from "@/components/admin/EventForm";
import { getAllPlacesForAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const places = await getAllPlacesForAdmin();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-stone-900">New event</h1>
      <div className="mt-8">
        <EventForm places={places} />
      </div>
    </div>
  );
}
