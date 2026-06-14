"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SyncPlacesButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSync(mode: "google" | "mock") {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/sync-places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const data = (await response.json()) as {
        synced?: number;
        source?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error ?? "Sync failed");
      setMessage(
        `Synced ${data.synced} places (${data.source === "google" ? "Google Places" : "mock Worcester data"}).`,
      );
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sync failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSync("google")}
          className="rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 disabled:opacity-50"
        >
          Sync from Google
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSync("mock")}
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50 disabled:opacity-50"
        >
          Seed mock Worcester data
        </button>
      </div>
      {message && <p className="text-sm text-stone-600">{message}</p>}
    </div>
  );
}
