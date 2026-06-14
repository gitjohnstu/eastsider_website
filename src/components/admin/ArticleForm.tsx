"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { Article, Place } from "@prisma/client";

interface ArticleFormProps {
  places: Place[];
  article?: Article;
}

export function ArticleForm({ places, article }: ArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [body, setBody] = useState(article?.body ?? "");
  const [coverImage, setCoverImage] = useState(article?.coverImage ?? "");
  const [placeId, setPlaceId] = useState(article?.placeId ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    article?.status ?? "DRAFT",
  );
  const [placeQuery, setPlaceQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredPlaces = useMemo(() => {
    const q = placeQuery.trim().toLowerCase();
    if (!q) return places.slice(0, 10);
    return places
      .filter(
        (place) =>
          place.name.toLowerCase().includes(q) ||
          place.address.toLowerCase().includes(q),
      )
      .slice(0, 10);
  }, [placeQuery, places]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        article ? `/api/admin/articles/${article.id}` : "/api/admin/articles",
        {
          method: article ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            excerpt,
            body,
            coverImage,
            placeId: placeId || null,
            status,
          }),
        },
      );

      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Save failed");

      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-stone-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Body (Markdown)</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={14}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Cover image URL</label>
        <input
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Linked place</label>
        <input
          value={placeQuery}
          onChange={(e) => setPlaceQuery(e.target.value)}
          placeholder="Search imported Worcester places..."
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
        <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-stone-200">
          {filteredPlaces.map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={() => {
                setPlaceId(place.id);
                setPlaceQuery(place.name);
              }}
              className={`block w-full border-b border-stone-100 px-3 py-2 text-left text-sm last:border-0 hover:bg-stone-50 ${
                placeId === place.id ? "bg-amber-50" : ""
              }`}
            >
              <span className="font-medium">{place.name}</span>
              <span className="mt-0.5 block text-stone-500">{place.address}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
          className="mt-1 rounded-lg border border-stone-300 px-3 py-2"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-amber-800 px-5 py-2 text-sm font-medium text-white hover:bg-amber-900 disabled:opacity-50"
      >
        {saving ? "Saving..." : article ? "Update article" : "Create article"}
      </button>
    </form>
  );
}
